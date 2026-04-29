import { supabase } from "@/lib/supabase";
import {
  createdFromIds,
  leadSources,
  leadSourceByCreatedFromId,
  leadStatuses,
  leadStatusIds,
  type CreatedFromId,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "@shared/schema";

export const LEADS_QUERY_KEY = ["leads"] as const;

const DEFAULT_SOURCE: LeadSource = "Website";
const DEFAULT_STATUS: LeadStatus = "New";
const LEADS_SELECT =
  "*, created_from_type:created_from_id ( id, value ), status:lead_status_id ( id, value ), channel:channel_id ( id, value )";

function normalizeUuidString(s: string): string {
  return s.trim().toLowerCase();
}

/** Supabase `lead_statuses` row ids → app `LeadStatus` labels */
const LEAD_STATUS_BY_NORMALIZED_UUID = new Map<string, LeadStatus>();
for (const [uuid, label] of Object.entries(leadStatusIds)) {
  LEAD_STATUS_BY_NORMALIZED_UUID.set(normalizeUuidString(uuid), label);
}

function resolveLeadStatus(raw: unknown): LeadStatus {
  if (raw === undefined || raw === null) return DEFAULT_STATUS;
  if (typeof raw === "string") {
    const fromUuid = LEAD_STATUS_BY_NORMALIZED_UUID.get(normalizeUuidString(raw));
    if (fromUuid !== undefined) return fromUuid;
    if (isLeadStatus(raw)) return raw;
    return DEFAULT_STATUS;
  }
  if (isLeadStatus(raw)) return raw;
  return DEFAULT_STATUS;
}

/** Prefer `lead_status_id`, then `status_id`, then string `status`, then embedded relation `{ id, value }`. */
function extractStatusCandidate(row: Record<string, unknown>): unknown {
  const leadStatusId = row.lead_status_id ?? row.status_id;
  if (leadStatusId != null && leadStatusId !== "") {
    if (typeof leadStatusId === "string") return leadStatusId;
  }

  const st = row.status;
  if (typeof st === "string") return st;
  if (st !== null && typeof st === "object" && !Array.isArray(st)) {
    const o = st as Record<string, unknown>;
    if (typeof o.id === "string" && o.id !== "") return o.id;
    if (typeof o.value === "string" && o.value !== "") return o.value;
  }
  return undefined;
}

function isLeadSource(value: unknown): value is LeadSource {
  return typeof value === "string" && (leadSources as readonly string[]).includes(value);
}

function isCreatedFromId(value: unknown): value is CreatedFromId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(leadSourceByCreatedFromId, value)
  );
}

function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === "string" && (leadStatuses as readonly string[]).includes(value);
}

function pickString(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

function pickNumber(row: Record<string, unknown>, ...keys: string[]): number {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "number" && !Number.isNaN(v)) return v;
    if (typeof v === "string") {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return 0;
}

function pickId(row: Record<string, unknown>): string {
  const id = row.id;
  if (typeof id === "string") return id;
  if (typeof id === "number") return String(id);
  return crypto.randomUUID();
}

function pickCreatedAt(row: Record<string, unknown>): string {
  const raw = row.created_at ?? row.createdAt;
  if (typeof raw === "string") {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString();
  }
  return new Date().toISOString();
}

function extractCreatedFromTypeValue(row: Record<string, unknown>): unknown {
  const createdFromType = row.created_from_type ?? row.createdFromType;
  if (typeof createdFromType === "string") return createdFromType;
  if (
    createdFromType !== null &&
    typeof createdFromType === "object" &&
    !Array.isArray(createdFromType)
  ) {
    const o = createdFromType as Record<string, unknown>;
    if (typeof o.value === "string" && o.value !== "") return o.value;
  }
  return undefined;
}

function resolveLeadSource(row: Record<string, unknown>): LeadSource {
  const fromRelation = extractCreatedFromTypeValue(row);
  if (isLeadSource(fromRelation)) return fromRelation;

  const createdFromId = pickString(row, "created_from_id", "createdFromId");
  if (isCreatedFromId(createdFromId)) {
    return leadSourceByCreatedFromId[createdFromId];
  }

  const legacySource = pickString(row, "source");
  if (isLeadSource(legacySource)) return legacySource;

  return DEFAULT_SOURCE;
}

function resolveCreatedFromId(
  row: Record<string, unknown>,
  source: LeadSource,
): CreatedFromId | undefined {
  const createdFromId = pickString(row, "created_from_id", "createdFromId");
  if (isCreatedFromId(createdFromId)) return createdFromId;
  return createdFromIds[source];
}

export function mapSupabaseLeadRow(row: Record<string, unknown>): Lead {
  const name = pickString(row, "name") ?? "Unknown";
  const email = pickString(row, "email") ?? "";
  const source = resolveLeadSource(row);

  const status = resolveLeadStatus(extractStatusCandidate(row));

  return {
    id: pickId(row),
    name,
    email,
    phone: pickString(row, "phone"),
    location: pickString(row, "location"),
    message_text: pickString(row, "message_text", "message"),
    created_from_id: resolveCreatedFromId(row, source),
    source,
    status,
    budget: pickNumber(row, "budget"),
    notes: pickString(row, "notes"),
    avatar: pickString(row, "avatar"),
    createdAt: pickCreatedAt(row),
    communicationId: pickString(row, "communication_id", "communicationId"),
  };
}

export async function fetchLeadByIdFromSupabase(leadId: string): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .select(LEADS_SELECT)
    .eq("id", leadId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSupabaseLeadRow(data as Record<string, unknown>);
}

export async function fetchLeadsFromSupabase(createdFromId?: string): Promise<Lead[]> {
  let query = supabase
    .from("leads")
    .select(LEADS_SELECT)
    .order("created_at", { ascending: false });

  if (isCreatedFromId(createdFromId)) {
    query = query.eq("created_from_id", createdFromId);
  }

  const { data, error } = await query;
  
  if (error) {
    throw new Error(error.message);
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((row) => mapSupabaseLeadRow(row));
}

export async function updateLeadStatus(leadId: string, statusId: string): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .update({ lead_status_id: statusId })
    .eq("id", leadId)
    .select(LEADS_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSupabaseLeadRow(data as Record<string, unknown>);
}

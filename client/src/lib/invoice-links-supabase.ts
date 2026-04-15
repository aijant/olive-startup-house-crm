import { supabase } from "@/lib/supabase";

export const INVOICE_LINKS_QUERY_KEY = ["invoice-links"] as const;

export type InvoiceLinkOption = {
  id: string;
  label: string;
  url: string;
};

function pickString(row: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.trim() !== "") return v;
  }
  return undefined;
}

function simpleHash(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function stableRowId(row: Record<string, unknown>, index: number, url: string): string {
  const id = row.id;
  if (typeof id === "string" && id.trim() !== "") return id;
  if (typeof id === "number" && !Number.isNaN(id)) return String(id);
  return `invoice-link-${index}-${simpleHash(url)}`;
}

/**
 * Loads `invoice_links` (e.g. `value` + `url` per row). Only rows with a non-empty URL are returned.
 */
export async function fetchInvoiceLinks(): Promise<InvoiceLinkOption[]> {
  const { data, error } = await supabase
    .from("invoice_links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data || !Array.isArray(data)) return [];

  const out: InvoiceLinkOption[] = [];
  for (let i = 0; i < data.length; i++) {
    const row = data[i] as Record<string, unknown>;
    const url = pickString(row, "url", "link", "href");
    if (!url) continue;
    const label =
      pickString(row, "value", "label", "name", "title") ?? "Payment link";
    out.push({
      id: stableRowId(row, i, url),
      label,
      url,
    });
  }
  return out;
}

/** True if the compose body includes any loaded invoice payment URL. */
export function bodyContainsInvoiceLink(
  body: string,
  links: InvoiceLinkOption[],
): boolean {
  return links.some((l) => l.url !== "" && body.includes(l.url));
}

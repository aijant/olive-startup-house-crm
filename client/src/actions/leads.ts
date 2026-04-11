import { z } from "zod";
import { apiFetch } from "@/lib/api";

export const createLeadBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone is required"),
  location: z.string().min(1, "Location is required"),
});

export type CreateLeadBody = z.infer<typeof createLeadBodySchema>;

export function createLead(body: CreateLeadBody) {
  return apiFetch<Record<string, unknown>>("create-lead", {
    method: "POST",
    body,
  });
}

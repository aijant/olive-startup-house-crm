import { apiFetch } from "@/lib/api";
import type {
  AdminActionSuccessResponse,
  AdminFilterSettingsResponse,
  AdminManagersResponse,
  AssignAdminManagerRolePayload,
  CreateAdminManagerPayload,
  DeleteAdminManagerPayload,
  UpdateAdminFilterSettingsPayload,
} from "@shared/schema";

export const getAdminManagers = () =>
  apiFetch<AdminManagersResponse>("get_admin_managers");

export const createAdminManager = (body: CreateAdminManagerPayload) =>
  apiFetch<{ manager: AdminManagersResponse["managers"][number] }>("create_admin_manager", {
    method: "POST",
    body,
  });

export const deleteAdminManager = (body: DeleteAdminManagerPayload) =>
  apiFetch<AdminActionSuccessResponse>("delete_admin_manager", {
    method: "DELETE",
    body,
  });

export const assignAdminManagerRole = (body: AssignAdminManagerRolePayload) =>
  apiFetch<AdminActionSuccessResponse>("assign_admin_manager_role", {
    method: "POST",
    body,
  });

export const getAdminFilterSettings = () =>
  apiFetch<AdminFilterSettingsResponse>("get_admin_filter_settings");

export const updateAdminFilterSettings = (body: UpdateAdminFilterSettingsPayload) =>
  apiFetch<AdminActionSuccessResponse>("update_admin_filter_settings", {
    method: "PUT",
    body,
  });

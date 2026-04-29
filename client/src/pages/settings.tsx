import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminManager,
  deleteAdminManager,
  getAdminFilterSettings,
  getAdminManagers,
  updateAdminFilterSettings,
  assignAdminManagerRole,
} from "@/actions/admin-settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/use-user-role";
import type {
  AdminFilterListKey,
  AdminFilterSettings,
  AdminManager,
} from "@shared/schema";
import {
  Bell,
  Database,
  Filter,
  Lock,
  Plus,
  Save,
  Settings,
  Shield,
  Trash2,
  Users,
  Zap,
} from "lucide-react";

const ADMIN_MANAGERS_QUERY_KEY = ["admin_managers"] as const;
const ADMIN_FILTER_SETTINGS_QUERY_KEY = ["admin_filter_settings"] as const;

const emptyFilterSettings: AdminFilterSettings = {
  keywords: [],
  statuses: [],
  recipients: [],
};

const filterSections: Array<{
  key: AdminFilterListKey;
  title: string;
  description: string;
  placeholder: string;
}> = [
  {
    key: "keywords",
    title: "Keywords",
    description: "Words used for admin-configurable filtering.",
    placeholder: "Add keyword",
  },
  {
    key: "statuses",
    title: "Statuses",
    description: "Status values available for admin filters.",
    placeholder: "Add status",
  },
  {
    key: "recipients",
    title: "Recipients",
    description: "Email addresses or recipient labels used in routing filters.",
    placeholder: "Add recipient",
  },
];

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    isLoading: isRoleLoading,
    canManageSettings,
    canManageManagers,
    canManageFilters,
  } = useUserRole();

  const canViewAdminSettings = canManageSettings || canManageManagers || canManageFilters;
  const [managerEmail, setManagerEmail] = useState("");
  const [managerName, setManagerName] = useState("");
  const [filters, setFilters] = useState<AdminFilterSettings>(emptyFilterSettings);
  const [newFilterValues, setNewFilterValues] = useState<Record<AdminFilterListKey, string>>({
    keywords: "",
    statuses: "",
    recipients: "",
  });

  const managersQuery = useQuery({
    queryKey: ADMIN_MANAGERS_QUERY_KEY,
    queryFn: getAdminManagers,
    enabled: canManageManagers,
  });

  const filterSettingsQuery = useQuery({
    queryKey: ADMIN_FILTER_SETTINGS_QUERY_KEY,
    queryFn: getAdminFilterSettings,
    enabled: canManageFilters,
  });

  useEffect(() => {
    if (filterSettingsQuery.data) {
      setFilters({
        keywords: filterSettingsQuery.data.keywords ?? [],
        statuses: filterSettingsQuery.data.statuses ?? [],
        recipients: filterSettingsQuery.data.recipients ?? [],
      });
    }
  }, [filterSettingsQuery.data]);

  const managers = useMemo(
    () => managersQuery.data?.managers ?? [],
    [managersQuery.data?.managers],
  );

  const createManagerMutation = useMutation({
    mutationFn: createAdminManager,
    onSuccess: () => {
      setManagerEmail("");
      setManagerName("");
      queryClient.invalidateQueries({ queryKey: ADMIN_MANAGERS_QUERY_KEY });
      toast({ title: "Manager added" });
    },
    onError: (error) => {
      toast({
        title: "Could not add manager",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteManagerMutation = useMutation({
    mutationFn: deleteAdminManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_MANAGERS_QUERY_KEY });
      toast({ title: "Manager removed" });
    },
    onError: (error) => {
      toast({
        title: "Could not remove manager",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const assignRoleMutation = useMutation({
    mutationFn: assignAdminManagerRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_MANAGERS_QUERY_KEY });
      toast({ title: "Role updated" });
    },
    onError: (error) => {
      toast({
        title: "Could not update role",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateFiltersMutation = useMutation({
    mutationFn: updateAdminFilterSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_FILTER_SETTINGS_QUERY_KEY });
      toast({ title: "Filter settings saved" });
    },
    onError: (error) => {
      toast({
        title: "Could not save filters",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  function handleCreateManager(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = managerEmail.trim();
    const name = managerName.trim();
    if (!email) {
      toast({ title: "Manager email is required", variant: "destructive" });
      return;
    }
    createManagerMutation.mutate({ email, ...(name ? { full_name: name } : {}) });
  }

  function handleAddFilterItem(key: AdminFilterListKey) {
    const value = newFilterValues[key].trim();
    if (!value) return;

    setFilters((current) => ({
      ...current,
      [key]: [...current[key], value],
    }));
    setNewFilterValues((current) => ({ ...current, [key]: "" }));
  }

  function handleRemoveFilterItem(key: AdminFilterListKey, itemIndex: number) {
    setFilters((current) => ({
      ...current,
      [key]: current[key].filter((_, index) => index !== itemIndex),
    }));
  }

  function handleSaveFilters() {
    updateFiltersMutation.mutate(filters);
  }

  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your platform preferences and configurations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRoleLoading ? (
            <p className="text-sm text-muted-foreground">Checking your admin permissions...</p>
          ) : canViewAdminSettings ? (
            <p className="text-sm text-muted-foreground">
              You can manage managers and configurable filter lists from this page.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Admin-only manager and filter settings are hidden for your current role.
            </p>
          )}
        </CardContent>
      </Card>

      {canViewAdminSettings ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {canManageManagers ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Managers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="grid gap-3" onSubmit={handleCreateManager}>
                  <div className="grid gap-2">
                    <Label htmlFor="manager-email">Manager Email</Label>
                    <Input
                      id="manager-email"
                      type="email"
                      value={managerEmail}
                      onChange={(event) => setManagerEmail(event.target.value)}
                      placeholder="manager@example.com"
                      data-testid="input-manager-email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="manager-name">Name</Label>
                    <Input
                      id="manager-name"
                      value={managerName}
                      onChange={(event) => setManagerName(event.target.value)}
                      placeholder="Optional name"
                      data-testid="input-manager-name"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={createManagerMutation.isPending}
                    data-testid="button-add-manager"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manager
                  </Button>
                </form>

                <Separator />

                {managersQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading managers...</p>
                ) : managersQuery.isError ? (
                  <p className="text-sm text-destructive">
                    Manager API is not available yet. Expected endpoint: get_admin_managers.
                  </p>
                ) : managers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No managers found.</p>
                ) : (
                  <div className="space-y-3">
                    {managers.map((manager) => (
                      <ManagerRow
                        key={manager.id}
                        manager={manager}
                        onDelete={() =>
                          deleteManagerMutation.mutate({ user_id: manager.id })
                        }
                        onAssignManagerRole={() =>
                          assignRoleMutation.mutate({ user_id: manager.id, role: "manager" })
                        }
                        isMutating={
                          deleteManagerMutation.isPending || assignRoleMutation.isPending
                        }
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {canManageFilters ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Keyword Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {filterSettingsQuery.isError ? (
                  <p className="text-sm text-destructive">
                    Filter settings API is not available yet. Expected endpoint:
                    get_admin_filter_settings.
                  </p>
                ) : null}

                {filterSections.map((section) => (
                  <div key={section.key} className="space-y-3">
                    <div>
                      <Label>{section.title}</Label>
                      <p className="text-sm text-muted-foreground">{section.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newFilterValues[section.key]}
                        onChange={(event) =>
                          setNewFilterValues((current) => ({
                            ...current,
                            [section.key]: event.target.value,
                          }))
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            handleAddFilterItem(section.key);
                          }
                        }}
                        placeholder={section.placeholder}
                        data-testid={`input-filter-${section.key}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddFilterItem(section.key)}
                        data-testid={`button-add-filter-${section.key}`}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="flex min-h-9 flex-wrap gap-2 rounded-md border bg-muted/20 p-2">
                      {filters[section.key].length === 0 ? (
                        <span className="text-sm text-muted-foreground">No items yet.</span>
                      ) : (
                        filters[section.key].map((item, index) => (
                          <Badge
                            key={`${item}-${index}`}
                            variant="secondary"
                            className="gap-2 pr-1"
                          >
                            {item}
                            <button
                              type="button"
                              className="rounded-sm px-1 text-muted-foreground hover:text-foreground"
                              onClick={() => handleRemoveFilterItem(section.key, index)}
                              aria-label={`Remove ${item}`}
                            >
                              x
                            </button>
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  onClick={handleSaveFilters}
                  disabled={updateFiltersMutation.isPending || filterSettingsQuery.isLoading}
                  data-testid="button-save-filter-settings"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Filter Lists
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      ) : null}

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                defaultValue="Olive Startup House"
                data-testid="input-company-name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                defaultValue="America/Los_Angeles (PST)"
                data-testid="input-timezone"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>New Lead Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new leads come in
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-lead-alerts" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Screening Updates</Label>
              <p className="text-sm text-muted-foreground">
                Notifications for background check completions
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-screening-updates" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Onboarding Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders for upcoming move-ins
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-onboarding-reminders" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Community Events</Label>
              <p className="text-sm text-muted-foreground">
                Updates about upcoming community events
              </p>
            </div>
            <Switch data-testid="switch-community-events" />
          </div>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Integrations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>WhatsApp Business</Label>
              <p className="text-sm text-muted-foreground">
                Connect your WhatsApp Business account
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-connect-whatsapp">
              Connected
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Telegram Bot</Label>
              <p className="text-sm text-muted-foreground">
                Manage your Telegram community bot
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-connect-telegram">
              Connected
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Smart Lock API</Label>
              <p className="text-sm text-muted-foreground">
                Connect to your smart lock provider
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-connect-smartlock">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Switch data-testid="switch-2fa" />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">
                Automatically log out after inactivity
              </p>
            </div>
            <Switch defaultChecked data-testid="switch-session-timeout" />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">
                Download all your platform data
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-export-data">
              Export
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label>Backup Settings</Label>
              <p className="text-sm text-muted-foreground">
                Configure automatic backups
              </p>
            </div>
            <Button variant="outline" size="sm" data-testid="button-backup-settings">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button data-testid="button-save-settings">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

function ManagerRow({
  manager,
  onDelete,
  onAssignManagerRole,
  isMutating,
}: {
  manager: AdminManager;
  onDelete: () => void;
  onAssignManagerRole: () => void;
  isMutating: boolean;
}) {
  return (
    <div className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
      <div className="min-w-0">
        <p className="truncate font-medium">{manager.full_name || manager.name || manager.email}</p>
        <p className="truncate text-sm text-muted-foreground">{manager.email}</p>
      </div>
      <Badge variant="outline">{manager.role}</Badge>
      {manager.role !== "manager" ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAssignManagerRole}
          disabled={isMutating}
          data-testid={`button-assign-manager-${manager.id}`}
        >
          Assign Manager
        </Button>
      ) : null}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onDelete}
        disabled={isMutating}
        data-testid={`button-delete-manager-${manager.id}`}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
    </div>
  );
}

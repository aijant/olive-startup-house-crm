import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Settings,
  Bell,
  Lock,
  Globe,
  Palette,
  Database,
  Zap,
  Save,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your platform preferences and configurations</p>
      </div>

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

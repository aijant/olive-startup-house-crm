import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Plus, UserCircle, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { InsertProfile } from "@shared/schema";
import { insertProfileSchema } from "@shared/schema";
import { FileDropZone } from "@/components/file-drop-zone";

export function CommunityProfiles() {
  const { toast } = useToast();
  const [showAddProfileForm, setShowAddProfileForm] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const profileForm = useForm<InsertProfile>({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: { name: "", position: "", description: "", room: "", linkedin_url: "" },
  });

  const resetProfileForm = () => {
    profileForm.reset();
    setAvatarFile(null);
    setShowAddProfileForm(false);
  };

  const onSubmitProfile = async (data: InsertProfile) => {
    setProfileUploading(true);
    try {
      const body = new FormData();
      body.append("name", data.name);
      body.append("position", data.position);
      if (data.description) body.append("description", data.description);
      if (data.room) body.append("room", data.room);
      if (data.linkedin_url) body.append("linkedin_url", data.linkedin_url);
      if (avatarFile) body.append("avatar", avatarFile);

      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshData.session?.access_token) {
        throw new Error("Session expired — please log out and log in again.");
      }

      const { error: fnError } = await supabase.functions.invoke("create-community-profile", {
        body,
        headers: { Authorization: `Bearer ${refreshData.session.access_token}` },
      });
      if (fnError) throw fnError;

      resetProfileForm();
      toast({ title: "Profile created", description: `"${data.name}" has been added.` });
    } catch (err) {
      toast({
        title: "Failed to create profile",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setProfileUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Community Profiles</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Member profiles for the co-living community</p>
          </div>
          <Button size="sm" onClick={() => setShowAddProfileForm((v) => !v)}>
            {showAddProfileForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showAddProfileForm ? "Cancel" : "Add Profile"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showAddProfileForm ? (
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                          <Input placeholder="Founder & CEO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="room"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room <span className="text-muted-foreground">(optional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Room 204" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL <span className="text-muted-foreground">(optional)</span></FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={profileForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description <span className="text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief bio or description..." rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <p className="text-sm font-medium mb-2">Avatar <span className="text-muted-foreground">(optional)</span></p>
                  <FileDropZone
                    accept=".jpg,.jpeg,.png,.webp,.gif"
                    label="Upload profile photo"
                    file={avatarFile}
                    onChange={setAvatarFile}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetProfileForm} disabled={profileUploading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={profileUploading}>
                    {profileUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      "Add Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        ) : (
          <div className="text-center py-12">
            <UserCircle className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mt-4">No profiles added yet</p>
            <p className="text-sm text-muted-foreground">Add member profiles to showcase your community.</p>
            <Button className="mt-4" onClick={() => setShowAddProfileForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Profile
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

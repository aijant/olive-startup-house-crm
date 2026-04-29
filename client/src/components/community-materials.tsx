import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  BookOpen,
  BookMarked,
  Presentation,
  Lightbulb,
  FileText,
  X,
  Loader2,
  Video,
  Link2,
  ExternalLink,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  downloadCommunityDocumentFromStorage,
  openCommunityDocumentPreviewFromStorage,
  storageBucketForCommunityDocument,
} from "@/lib/community-document-storage";
import type {
  InsertMaterial,
  MaterialTypeId,
  MaterialTypeValue,
  CommunityDocument,
  CommunityDocumentsPagination,
  CommunityDocumentAudience,
  InternalDocumentManager,
} from "@shared/schema";
import { insertMaterialSchema, materialTypes, materialTypeIds } from "@shared/schema";
import { FileDropZone } from "@/components/file-drop-zone";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getCommunityDocuments,
  getClientDocuments,
  getInternalDocuments,
  getInternalDocumentManagers,
  createInternalDocument,
  editCommunityDocument,
  editInternalDocument,
  deleteCommunityDocument,
  deleteInternalDocument,
  assignInternalDocumentManagers,
} from "@/actions/community";
import { useUserRole } from "@/hooks/use-user-role";
import { Checkbox } from "@/components/ui/checkbox";

const LINK_TYPE_ID: MaterialTypeId = materialTypeIds.link;
const DOCUMENT_TYPE_ID: MaterialTypeId = materialTypeIds.document;

const materialTypeConfig = {
  [materialTypeIds.document]: { label: "Document", icon: FileText,    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  [materialTypeIds.slide]:    { label: "Slide",    icon: Presentation, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  [materialTypeIds.tip]:      { label: "Tip",      icon: Lightbulb,    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  [materialTypeIds.video]:    { label: "Video",    icon: Video,        color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  [materialTypeIds.guide]:    { label: "Guide",    icon: BookMarked,   color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  [materialTypeIds.rule]:     { label: "Rule",     icon: BookOpen,     color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  [materialTypeIds.link]:     { label: "Link",     icon: Link2,        color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
} as unknown as Record<MaterialTypeId, { label: string; icon: React.ElementType; color: string }>;

const acceptByType = {
  [materialTypeIds.document]: ".pdf,.doc,.docx,.xls,.xlsx,.xml",
  [materialTypeIds.slide]:    ".jpg,.jpeg,.png,.webp,.gif,.ppt,.pptx",
  [materialTypeIds.tip]:      ".jpg,.jpeg,.png,.webp,.gif,.pdf,.doc,.docx",
  [materialTypeIds.video]:    ".mp4,.webm,.mov,.avi",
  [materialTypeIds.guide]:    ".pdf,.doc,.docx",
  [materialTypeIds.rule]:     ".pdf,.doc,.docx,.xls,.xlsx,.xml",
  [materialTypeIds.link]:     "",
} as unknown as Record<MaterialTypeId, string>;

function materialRowConfig(doc: CommunityDocument) {
  if (doc.type_id && materialTypeConfig[doc.type_id]) {
    return materialTypeConfig[doc.type_id];
  }
  const v = doc.type?.value;
  if (v && v in materialTypeIds) {
    return materialTypeConfig[materialTypeIds[v as MaterialTypeValue]];
  }
  return materialTypeConfig[materialTypeIds.document];
}

function isLinkDocument(doc: CommunityDocument): boolean {
  return doc.type?.value === "link" || doc.type_id === materialTypeIds.link;
}

function materialTypeIdForDoc(doc: CommunityDocument): MaterialTypeId {
  if (doc.type_id && materialTypeConfig[doc.type_id]) return doc.type_id;
  const v = doc.type?.value;
  if (v && v in materialTypeIds) return materialTypeIds[v as MaterialTypeValue];
  return materialTypeIds.document;
}

function MaterialDocRow({
  doc,
  downloadingId,
  variant = "external",
  canManage = true,
  onEdit,
  onDelete,
  onPreview,
  onDownload,
}: {
  doc: CommunityDocument;
  downloadingId: string | null;
  variant?: "external" | "internal";
  canManage?: boolean;
  onEdit: (doc: CommunityDocument) => void;
  onDelete: (doc: CommunityDocument) => void;
  onPreview: (doc: CommunityDocument) => void;
  onDownload: (doc: CommunityDocument) => void;
}) {
  const config = materialRowConfig(doc);
  const Icon = config.icon;
  const href = doc.link ?? doc.url;
  const canDownloadFromStorage = !isLinkDocument(doc) && !!doc.file_path;
  const canPreview = canDownloadFromStorage || !!href;
  const isDownloading = downloadingId === doc.id;
  const rowClass =
    variant === "internal"
      ? "flex items-start gap-3 p-3 bg-amber-50/60 hover:bg-amber-50 transition-colors dark:bg-amber-950/20 dark:hover:bg-amber-950/30"
      : "flex items-start gap-3 p-3 hover:bg-muted/30 transition-colors";
  return (
    <div className={rowClass}>
      <span
        className={`inline-flex items-center justify-center rounded-md p-2 flex-shrink-0 ${
          variant === "internal"
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
            : config.color
        }`}
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : variant === "internal" ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
      </span>
      <div
        className={
          canPreview
            ? "min-w-0 flex-1 text-left cursor-pointer rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            : "min-w-0 flex-1"
        }
        role={canPreview ? "button" : undefined}
        tabIndex={canPreview ? 0 : undefined}
        aria-busy={canPreview ? isDownloading : undefined}
        aria-label={canPreview ? `Open ${doc.title}` : undefined}
        onClick={
          canPreview && !isDownloading ? () => void onPreview(doc) : undefined
        }
        onKeyDown={
          canPreview && !isDownloading
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  void onPreview(doc);
                }
              }
            : undefined
        }
      >
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm truncate">{doc.title}</p>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${config.color}`}>
            {config.label}
          </span>
          {variant === "internal" && (
            <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Internal
            </span>
          )}
        </div>
        {doc.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.description}</p>
        )}
        {variant === "internal" && doc.assigned_managers && doc.assigned_managers.length > 0 && (
          <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-1 line-clamp-1">
            Assigned to {doc.assigned_managers.map((m) => m.name || m.email || m.id).join(", ")}
          </p>
        )}
      </div>
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {canPreview && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Preview material"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(doc);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {canDownloadFromStorage && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Download material"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(doc);
            }}
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {canManage && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Edit material"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(doc);
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              aria-label="Delete material"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(doc);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors p-2"
            aria-label="Open link"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}

function DocumentListPagination({
  pagination,
  onPageChange,
}: {
  pagination: CommunityDocumentsPagination;
  onPageChange: (page: number) => void;
}) {
  if (pagination.total_pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 pt-2 border-t border-border">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
        disabled={!pagination.has_prev}
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {pagination.page} of {pagination.total_pages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!pagination.has_next}
      >
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
}

export function CommunityMaterials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    canViewInternalDocuments,
    canAssignInternalDocuments,
    isLoading: userRoleLoading,
  } = useUserRole();
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [addAudience, setAddAudience] = useState<CommunityDocumentAudience>("common");
  const [selectedManagerIds, setSelectedManagerIds] = useState<string[]>([]);
  const [managerOptions, setManagerOptions] = useState<InternalDocumentManager[]>([]);
  const [loadingManagers, setLoadingManagers] = useState(false);

  const [documentsCommon, setDocumentsCommon] = useState<CommunityDocument[]>([]);
  const [paginationCommon, setPaginationCommon] = useState<CommunityDocumentsPagination | null>(null);
  const [pageCommon, setPageCommon] = useState(1);
  const [loadingCommon, setLoadingCommon] = useState(true);

  const [documentsClient, setDocumentsClient] = useState<CommunityDocument[]>([]);
  const [paginationClient, setPaginationClient] = useState<CommunityDocumentsPagination | null>(null);
  const [pageClient, setPageClient] = useState(1);
  const [loadingClient, setLoadingClient] = useState(true);

  const [documentsInternal, setDocumentsInternal] = useState<CommunityDocument[]>([]);
  const [paginationInternal, setPaginationInternal] = useState<CommunityDocumentsPagination | null>(null);
  const [pageInternal, setPageInternal] = useState(1);
  const [loadingInternal, setLoadingInternal] = useState(false);

  const [editingDoc, setEditingDoc] = useState<CommunityDocument | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editManagerIds, setEditManagerIds] = useState<string[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);

  const [deletingDoc, setDeletingDoc] = useState<CommunityDocument | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const form = useForm<InsertMaterial>({
    resolver: zodResolver(insertMaterialSchema),
    defaultValues: { title: "", description: "", type: DOCUMENT_TYPE_ID, url: "" },
  });

  const selectedType = form.watch("type") as MaterialTypeId;
  const isLinkType = selectedType === LINK_TYPE_ID;
  const isAddingInternal = addAudience === "internal";

  const toggleSelectedManager = (managerId: string) => {
    setSelectedManagerIds((current) =>
      current.includes(managerId)
        ? current.filter((id) => id !== managerId)
        : [...current, managerId],
    );
  };

  const toggleEditManager = (managerId: string) => {
    setEditManagerIds((current) =>
      current.includes(managerId)
        ? current.filter((id) => id !== managerId)
        : [...current, managerId],
    );
  };

  const loadCommonPage = useCallback(async (p: number) => {
    setLoadingCommon(true);
    try {
      const { documents: docs, pagination: pag } = await getCommunityDocuments(p);
      const filtered = (docs ?? []).filter((d) => d.doc_type !== "client");
      setDocumentsCommon(filtered);
      setPaginationCommon(pag);
    } catch {
      setPaginationCommon(null);
    } finally {
      setLoadingCommon(false);
    }
  }, []);

  const loadClientPage = useCallback(async (p: number) => {
    setLoadingClient(true);
    try {
      const { documents: docs, pagination: pag } = await getClientDocuments(p);
      setDocumentsClient(docs ?? []);
      setPaginationClient(pag);
    } catch {
      setPaginationClient(null);
    } finally {
      setLoadingClient(false);
    }
  }, []);

  const loadInternalPage = useCallback(async (p: number) => {
    if (!canViewInternalDocuments) {
      setDocumentsInternal([]);
      setPaginationInternal(null);
      setLoadingInternal(false);
      return;
    }
    setLoadingInternal(true);
    try {
      const { documents: docs, pagination: pag } = await getInternalDocuments(p);
      setDocumentsInternal((docs ?? []).map((doc) => ({ ...doc, doc_type: "internal" })));
      setPaginationInternal(pag);
    } catch {
      setPaginationInternal(null);
    } finally {
      setLoadingInternal(false);
    }
  }, [canViewInternalDocuments]);

  const loadManagers = useCallback(async () => {
    if (!canAssignInternalDocuments) {
      setManagerOptions([]);
      return;
    }
    setLoadingManagers(true);
    try {
      const { managers } = await getInternalDocumentManagers();
      setManagerOptions(managers ?? []);
    } catch {
      setManagerOptions([]);
    } finally {
      setLoadingManagers(false);
    }
  }, [canAssignInternalDocuments]);

  useEffect(() => {
    void loadCommonPage(pageCommon);
  }, [pageCommon, loadCommonPage]);

  useEffect(() => {
    void loadClientPage(pageClient);
  }, [pageClient, loadClientPage]);

  useEffect(() => {
    if (userRoleLoading) return;
    void loadInternalPage(pageInternal);
  }, [pageInternal, loadInternalPage, userRoleLoading]);

  useEffect(() => {
    if (userRoleLoading) return;
    void loadManagers();
  }, [loadManagers, userRoleLoading]);

  const refreshBothLists = useCallback(async () => {
    await Promise.all([
      loadCommonPage(pageCommon),
      loadClientPage(pageClient),
      canViewInternalDocuments ? loadInternalPage(pageInternal) : Promise.resolve(),
    ]);
  }, [
    canViewInternalDocuments,
    loadCommonPage,
    loadClientPage,
    loadInternalPage,
    pageCommon,
    pageClient,
    pageInternal,
  ]);

  const resetForm = () => {
    form.reset();
    setMainFile(null);
    setAddAudience("common");
    setSelectedManagerIds([]);
    setShowAddForm(false);
  };

  const onSubmit = async (data: InsertMaterial) => {
    if (isAddingInternal && !canAssignInternalDocuments) {
      toast({ title: "Only admins can add internal documents", variant: "destructive" });
      return;
    }
    if (!isLinkType && !mainFile) {
      toast({ title: "Please select a file", variant: "destructive" });
      return;
    }
    if (isLinkType && !data.url) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("type_id", data.type);
      body.append("title", data.title);
      if (data.description) body.append("description", data.description);

      if (isLinkType) {
        body.append("link", data.url!);
      } else {
        body.append("file", mainFile!);
      }
      body.append("doc_type", addAudience);
      if (isAddingInternal) {
        body.append("manager_ids", JSON.stringify(selectedManagerIds));
      }

      if (isAddingInternal) {
        await createInternalDocument(body);
      } else {
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshData.session?.access_token) {
          throw new Error("Session expired — please log out and log in again.");
        }

        // load_community_document: `community-documents` when doc_type is common, `client-documents` when client.
        const { error: fnError } = await supabase.functions.invoke("load_community_document", {
          body,
          headers: { Authorization: `Bearer ${refreshData.session.access_token}` },
        });
        if (fnError) throw fnError;
      }

      resetForm();
      toast({ title: "Material uploaded", description: `"${data.title}" has been sent.` });
      void queryClient.invalidateQueries({ queryKey: ["community-documents"] });
      if (addAudience === "internal") {
        if (pageInternal === 1) await loadInternalPage(1);
        else setPageInternal(1);
      } else if (addAudience === "common") {
        if (pageCommon === 1) await loadCommonPage(1);
        else setPageCommon(1);
      } else {
        if (pageClient === 1) await loadClientPage(1);
        else setPageClient(1);
      }
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const openEdit = (doc: CommunityDocument) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditDescription(doc.description ?? "");
    setEditLink((doc.link ?? doc.url) ?? "");
    setEditFile(null);
    setEditManagerIds(doc.assigned_manager_ids ?? doc.assigned_managers?.map((m) => m.id) ?? []);
  };

  const saveEdit = async () => {
    if (!editingDoc) return;
    if (!editTitle.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    if (isLinkDocument(editingDoc)) {
      const link = editLink.trim();
      if (!link) {
        toast({ title: "Please enter a URL", variant: "destructive" });
        return;
      }
      let urlOk = false;
      try {
        const u = new URL(link);
        urlOk = u.protocol === "http:" || u.protocol === "https:";
      } catch {
        urlOk = false;
      }
      if (!urlOk) {
        toast({ title: "Please enter a valid URL", variant: "destructive" });
        return;
      }
    }

    setSavingEdit(true);
    try {
      const fd = new FormData();
      fd.append("document_id", editingDoc.id);
      fd.append("title", editTitle.trim());
      if (editDescription.trim()) fd.append("description", editDescription.trim());
      if (isLinkDocument(editingDoc)) {
        fd.append("link", editLink.trim());
      } else if (editFile) {
        fd.append("file", editFile);
      }
      fd.append("doc_type", editingDoc.doc_type ?? "common");
      if (editingDoc.doc_type === "internal") {
        if (canAssignInternalDocuments) {
          fd.append("manager_ids", JSON.stringify(editManagerIds));
        }
        await editInternalDocument(fd);
        if (canAssignInternalDocuments) {
          await assignInternalDocumentManagers(editingDoc.id, editManagerIds);
        }
      } else {
        await editCommunityDocument(fd);
      }
      toast({ title: "Material updated", description: `"${editTitle.trim()}" has been saved.` });
      setEditingDoc(null);
      setEditFile(null);
      void queryClient.invalidateQueries({ queryKey: ["community-documents"] });
      await refreshBothLists();
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingDoc) return;
    setDeleting(true);
    try {
      if (deletingDoc.doc_type === "internal") {
        await deleteInternalDocument(deletingDoc.id);
      } else {
        await deleteCommunityDocument(deletingDoc.id, deletingDoc.doc_type ?? "common");
      }
      toast({ title: "Material deleted", description: `"${deletingDoc.title}" has been removed.` });
      setDeletingDoc(null);
      void queryClient.invalidateQueries({ queryKey: ["community-documents"] });
      await refreshBothLists();
    } catch (err) {
      toast({
        title: "Delete failed",
        description: err instanceof Error ? err.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handlePreviewMaterial = async (doc: CommunityDocument) => {
    const href = doc.link ?? doc.url;
    if (href && (isLinkDocument(doc) || !doc.file_path)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (!doc.file_path) return;
    setDownloadingId(doc.id);
    try {
      const result = await openCommunityDocumentPreviewFromStorage(
        supabase,
        storageBucketForCommunityDocument(doc),
        doc.file_path,
      );
      if (!result.ok) {
        toast({ title: "Preview failed", description: result.message, variant: "destructive" });
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadMaterial = async (doc: CommunityDocument) => {
    if (!doc.file_path) return;
    setDownloadingId(doc.id);
    try {
      const result = await downloadCommunityDocumentFromStorage(
        supabase,
        storageBucketForCommunityDocument(doc),
        doc.file_path,
        doc.title,
      );
      if (!result.ok) {
        toast({ title: "Download failed", description: result.message, variant: "destructive" });
      }
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <>
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">External documents</CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Rules, slides, and tips for residents</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowAddForm((v) => !v)}>
              {showAddForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {showAddForm ? "Cancel" : "Add Material"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="House Rules 2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={(v) => { field.onChange(v); setMainFile(null); }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(Object.keys(materialTypes) as MaterialTypeId[]).map((id) => (
                              <SelectItem key={id} value={id}>
                                {materialTypeConfig[id].label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="community-doc-type" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Document type
                  </label>
                  <Select
                    value={addAudience}
                    onValueChange={(v) => setAddAudience(v as CommunityDocumentAudience)}
                  >
                    <SelectTrigger id="community-doc-type" className="w-full sm:max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">common</SelectItem>
                      <SelectItem value="client">client</SelectItem>
                      {canAssignInternalDocuments && (
                        <SelectItem value="internal">internal</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {isAddingInternal && canAssignInternalDocuments && (
                  <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3 space-y-2 dark:border-amber-900/60 dark:bg-amber-950/20">
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                        Manager access
                      </p>
                      <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                        Only selected managers and admins will be able to preview this document.
                      </p>
                    </div>
                    {loadingManagers ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Loading managers…
                      </div>
                    ) : managerOptions.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {managerOptions.map((manager) => (
                          <label
                            key={manager.id}
                            className="flex items-center gap-2 rounded-md border border-amber-200/70 bg-background/70 px-3 py-2 text-sm dark:border-amber-900/50"
                          >
                            <Checkbox
                              checked={selectedManagerIds.includes(manager.id)}
                              onCheckedChange={() => toggleSelectedManager(manager.id)}
                            />
                            <span className="min-w-0 truncate">
                              {manager.name || manager.email || manager.id}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Manager list endpoint is not available yet.
                      </p>
                    )}
                  </div>
                )}

                {isLinkType ? (
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/resource" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div>
                    <p className="text-sm font-medium mb-2">File</p>
                    <FileDropZone
                      accept={acceptByType[selectedType]}
                      label={`Upload ${materialTypeConfig[selectedType].label.toLowerCase()} file`}
                      file={mainFile}
                      onChange={setMainFile}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description <span className="text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description visible to residents..." rows={2} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm} disabled={uploading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading…
                      </>
                    ) : (
                      "Send Material"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">General community documents</h3>
            {loadingCommon ? (
              <div className="flex items-center justify-center py-12 rounded-lg border border-border">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : documentsCommon.length > 0 ? (
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {documentsCommon.map((doc) => (
                  <MaterialDocRow
                    key={doc.id}
                    doc={doc}
                    downloadingId={downloadingId}
                    onEdit={openEdit}
                    onDelete={setDeletingDoc}
                    onPreview={handlePreviewMaterial}
                    onDownload={handleDownloadMaterial}
                  />
                ))}
                {paginationCommon && (
                  <DocumentListPagination
                    pagination={paginationCommon}
                    onPageChange={setPageCommon}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 px-1 rounded-lg border border-dashed border-border text-center">
                No common documents yet.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Documents for customers</h3>
            {loadingClient ? (
              <div className="flex items-center justify-center py-12 rounded-lg border border-border">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : documentsClient.length > 0 ? (
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {documentsClient.map((doc) => (
                  <MaterialDocRow
                    key={doc.id}
                    doc={doc}
                    downloadingId={downloadingId}
                    onEdit={openEdit}
                    onDelete={setDeletingDoc}
                    onPreview={handlePreviewMaterial}
                    onDownload={handleDownloadMaterial}
                  />
                ))}
                {paginationClient && (
                  <DocumentListPagination
                    pagination={paginationClient}
                    onPageChange={setPageClient}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-6 px-1 rounded-lg border border-dashed border-border text-center">
                No client documents yet.
              </p>
            )}
          </div>

          {canViewInternalDocuments && (
            <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50/40 p-3 dark:border-amber-900/60 dark:bg-amber-950/10">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-950 dark:text-amber-200">
                  <ShieldCheck className="h-4 w-4" />
                  Internal documents
                </h3>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                  Manager-only documents. Access is assigned by admins.
                </p>
              </div>
              {userRoleLoading || loadingInternal ? (
                <div className="flex items-center justify-center py-12 rounded-lg border border-amber-200/80 bg-background/70 dark:border-amber-900/60">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : documentsInternal.length > 0 ? (
                <div className="divide-y divide-amber-200/80 rounded-lg border border-amber-200/80 overflow-hidden bg-background dark:divide-amber-900/60 dark:border-amber-900/60">
                  {documentsInternal.map((doc) => (
                    <MaterialDocRow
                      key={doc.id}
                      doc={doc}
                      variant="internal"
                      canManage={canAssignInternalDocuments}
                      downloadingId={downloadingId}
                      onEdit={openEdit}
                      onDelete={setDeletingDoc}
                      onPreview={handlePreviewMaterial}
                      onDownload={handleDownloadMaterial}
                    />
                  ))}
                  {paginationInternal && (
                    <DocumentListPagination
                      pagination={paginationInternal}
                      onPageChange={setPageInternal}
                    />
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-6 px-1 rounded-lg border border-dashed border-amber-200 text-center dark:border-amber-900/60">
                  No internal documents available.
                </p>
              )}
            </div>
          )}
        </div>

        {!loadingCommon &&
          !loadingClient &&
          !loadingInternal &&
          documentsCommon.length === 0 &&
          documentsClient.length === 0 &&
          (!canViewInternalDocuments || documentsInternal.length === 0) &&
          !showAddForm && (
            <div className="text-center py-8 -mt-4">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-muted-foreground mt-4">No materials added yet</p>
              <p className="text-sm text-muted-foreground">Upload documents, slides, or tips for your residents.</p>
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Material
              </Button>
            </div>
          )}
      </CardContent>
    </Card>

    <Dialog
      open={editingDoc !== null}
      onOpenChange={(open) => {
        if (!open) {
          setEditingDoc(null);
          setEditFile(null);
          setEditManagerIds([]);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit material</DialogTitle>
        </DialogHeader>
        {editingDoc && (
          <div className="space-y-4 py-1">
            <div>
              <p className="text-sm font-medium mb-1.5">Title</p>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
            </div>
            {isLinkDocument(editingDoc) ? (
              <div>
                <p className="text-sm font-medium mb-1.5">URL</p>
                <Input value={editLink} onChange={(e) => setEditLink(e.target.value)} placeholder="https://…" />
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium mb-2">Replace file <span className="text-muted-foreground font-normal">(optional)</span></p>
                <FileDropZone
                  accept={acceptByType[materialTypeIdForDoc(editingDoc)]}
                  label={`New ${materialTypeConfig[materialTypeIdForDoc(editingDoc)].label.toLowerCase()} file`}
                  file={editFile}
                  onChange={setEditFile}
                />
              </div>
            )}
            {editingDoc.doc_type === "internal" && canAssignInternalDocuments && (
              <div className="rounded-md border border-amber-200 bg-amber-50/70 p-3 space-y-2 dark:border-amber-900/60 dark:bg-amber-950/20">
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                    Manager access
                  </p>
                  <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                    Admins manage which managers can preview this internal document.
                  </p>
                </div>
                {loadingManagers ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Loading managers…
                  </div>
                ) : managerOptions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-auto pr-1">
                    {managerOptions.map((manager) => (
                      <label
                        key={manager.id}
                        className="flex items-center gap-2 rounded-md border border-amber-200/70 bg-background/70 px-3 py-2 text-sm dark:border-amber-900/50"
                      >
                        <Checkbox
                          checked={editManagerIds.includes(manager.id)}
                          onCheckedChange={() => toggleEditManager(manager.id)}
                        />
                        <span className="min-w-0 truncate">
                          {manager.name || manager.email || manager.id}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Manager list endpoint is not available yet.
                  </p>
                )}
              </div>
            )}
            <div>
              <p className="text-sm font-medium mb-1.5">Description <span className="text-muted-foreground font-normal">(optional)</span></p>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Brief description…"
                rows={2}
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditingDoc(null);
              setEditFile(null);
              setEditManagerIds([]);
            }}
            disabled={savingEdit}
          >
            Cancel
          </Button>
          <Button type="button" onClick={() => void saveEdit()} disabled={savingEdit}>
            {savingEdit ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog open={deletingDoc !== null} onOpenChange={(open) => { if (!open) setDeletingDoc(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this material?</AlertDialogTitle>
          <AlertDialogDescription>
            {deletingDoc ? (
              <>This will remove &quot;{deletingDoc.title}&quot; from community materials. This cannot be undone.</>
            ) : null}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" onClick={() => void confirmDelete()} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting…
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

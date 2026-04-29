-- Bucket `internal-documents` for manager-only internal materials.
-- Apply via Supabase SQL editor or `supabase db push` when using the Supabase CLI.

INSERT INTO storage.buckets (id, name, public)
VALUES ('internal-documents', 'internal-documents', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "internal_documents_select_authenticated" ON storage.objects;
CREATE POLICY "internal_documents_select_authenticated"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'internal-documents'
  AND EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_roles.id = auth.uid()
      AND user_roles.role IN ('admin', 'manager')
  )
);

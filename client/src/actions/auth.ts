import { supabase } from "@/lib/supabase";

export type AuthActionResult =
  | { ok: true }
  | { ok: false; error: string };

export type SignUpResult = { ok: true; hasSession: boolean } | { ok: false; error: string };

export async function signIn(email: string, password: string): Promise<AuthActionResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    // Password must be passed as-is; trimming can change the user's password.
    password,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function signUp(email: string, password: string): Promise<SignUpResult> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    // Password must be passed as-is; trimming can change the user's password.
    password,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, hasSession: Boolean(data.session) };
}

export async function requestPasswordReset(email: string): Promise<AuthActionResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: window.location.origin,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}


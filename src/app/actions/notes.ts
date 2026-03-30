"use server";

import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types/note";

type ActionResult<T> = { data: T | null; error: string | null };

const EMPTY_TIPTAP_DOC = { type: "doc", content: [{ type: "paragraph" }] };

export async function createNote(
  title = "New Note"
): Promise<ActionResult<Note>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title,
      body: EMPTY_TIPTAP_DOC,
      body_text: "",
      is_pinned: false,
      deleted_at: null,
    })
    .select()
    .single();

  if (error) return { data: null, error: error.message };
  return { data: data as Note, error: null };
}

export async function deleteNote(id: string): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase
    .from("notes")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

export async function pinNote(
  id: string,
  isPinned: boolean
): Promise<ActionResult<null>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { error } = await supabase
    .from("notes")
    .update({ is_pinned: isPinned })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { data: null, error: error.message };
  return { data: null, error: null };
}

export async function duplicateNote(id: string): Promise<ActionResult<Note>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data: original, error: fetchError } = await supabase
    .from("notes")
    .select()
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (fetchError || !original) {
    return { data: null, error: fetchError?.message ?? "Note not found" };
  }

  const { data: copy, error: insertError } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: `Copy of ${original.title}`,
      body: original.body,
      body_text: original.body_text,
      is_pinned: false,
      deleted_at: null,
    })
    .select()
    .single();

  if (insertError) return { data: null, error: insertError.message };
  return { data: copy as Note, error: null };
}

export type Note = {
  id: string;
  user_id: string;
  title: string;
  body: Record<string, unknown>; // ProseMirror JSON document
  body_text: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

/** Shape accepted by Supabase insert — id and timestamps are DB-generated. */
export type NoteInsert = Omit<Note, "id" | "created_at" | "updated_at">;

/** Shape accepted by Supabase update — id, user_id, and created_at are immutable. */
export type NoteUpdate = Partial<Omit<Note, "id" | "user_id" | "created_at">>;

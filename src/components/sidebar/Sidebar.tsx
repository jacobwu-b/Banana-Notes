import { createClient } from "@/lib/supabase/server";
import type { Note } from "@/lib/types/note";
import { NewNoteButton } from "./NewNoteButton";
import { NoteListItem } from "./NoteListItem";

export async function Sidebar({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  const noteList: Note[] = (notes as Note[]) ?? [];

  return (
    <aside className="w-[260px] flex-shrink-0 flex flex-col bg-stone-100 border-r border-gray-200 overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <NewNoteButton />
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {noteList.length === 0 ? (
          <p className="text-center text-sm text-gray-400 px-4 pt-10 leading-relaxed">
            Nothing here yet —<br />go bananas! 🍌
          </p>
        ) : (
          noteList.map((note) => <NoteListItem key={note.id} note={note} />)
        )}
      </div>
    </aside>
  );
}

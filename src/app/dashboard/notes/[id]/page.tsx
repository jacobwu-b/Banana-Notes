import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (!note) redirect("/dashboard");

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">
        {note.title || "Untitled"}
      </h1>
      <p className="text-sm text-gray-400 mt-2">
        Editor coming in Phase 4.
      </p>
    </div>
  );
}

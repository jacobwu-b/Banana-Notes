import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/EmptyState";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notes } = await supabase
    .from("notes")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(1);

  if (notes && notes.length > 0) {
    redirect(`/dashboard/notes/${notes[0].id}`);
  }

  return (
    <div className="flex items-center justify-center h-full">
      <EmptyState />
    </div>
  );
}

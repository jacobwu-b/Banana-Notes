import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Sidebar } from "@/components/sidebar/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="h-screen flex flex-col bg-banana-cream overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="Banana Notes">
            🍌
          </span>
          <span className="font-bold text-gray-900">Banana Notes</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      {/* Two-column body */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar userId={user.id} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

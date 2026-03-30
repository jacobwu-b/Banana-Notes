"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/app/actions/notes";

export function EmptyState() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    const { data } = await createNote();
    if (data) {
      router.push(`/dashboard/notes/${data.id}`);
    }
    setLoading(false);
  }

  return (
    <div className="text-center px-8">
      <span className="text-8xl" role="img" aria-label="Banana">
        🍌
      </span>
      <h2 className="text-xl font-bold text-gray-900 mt-6">
        Nothing here yet
      </h2>
      <p className="text-gray-500 mt-2">Go bananas! Create your first note.</p>
      <button
        onClick={handleCreate}
        disabled={loading}
        className="mt-8 bg-banana-yellow text-gray-900 font-semibold px-6 py-3 rounded-xl hover:brightness-95 transition-all disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create your first note"}
      </button>
    </div>
  );
}

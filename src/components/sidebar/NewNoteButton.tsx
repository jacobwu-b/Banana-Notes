"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createNote } from "@/app/actions/notes";

export function NewNoteButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const { data } = await createNote();
    if (data) {
      router.push(`/dashboard/notes/${data.id}`);
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1.5 bg-banana-yellow text-gray-900 font-semibold text-sm py-2 px-3 rounded-lg hover:brightness-95 transition-all disabled:opacity-60"
    >
      <span className="text-base leading-none">+</span>
      {loading ? "Creating…" : "New Note"}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteNote, duplicateNote, pinNote } from "@/app/actions/notes";
import type { Note } from "@/lib/types/note";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function NoteListItem({ note }: { note: Note }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = pathname === `/dashboard/notes/${note.id}`;
  const title = note.title || "Untitled";
  const preview = note.body_text.split("\n")[0] ?? "";

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  async function handlePin() {
    setMenuOpen(false);
    await pinNote(note.id, !note.is_pinned);
    router.refresh();
  }

  async function handleDuplicate() {
    setMenuOpen(false);
    const { data } = await duplicateNote(note.id);
    if (data) {
      router.push(`/dashboard/notes/${data.id}`);
      router.refresh();
    }
  }

  async function handleDelete() {
    setMenuOpen(false);
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteNote(note.id);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div
      className={`relative group mx-2 my-0.5 rounded-lg transition-colors ${
        isActive
          ? "bg-banana-yellow/25"
          : "hover:bg-black/5 cursor-pointer"
      }`}
    >
      {/* Main clickable area */}
      <div
        className="px-3 py-2.5 pr-8"
        onClick={() => router.push(`/dashboard/notes/${note.id}`)}
      >
        <div className="flex items-center gap-1 min-w-0">
          {note.is_pinned && (
            <span className="text-xs flex-shrink-0" aria-label="Pinned">
              📌
            </span>
          )}
          <span className="text-sm font-medium text-gray-900 truncate">
            {title}
          </span>
        </div>
        {preview && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{preview}</p>
        )}
        <p className="text-xs text-gray-400 mt-0.5">
          {relativeTime(note.updated_at)}
        </p>
      </div>

      {/* ⋯ menu trigger */}
      <div ref={menuRef} className="absolute right-1.5 top-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-black/10 transition-all"
          aria-label="Note options"
        >
          •••
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-7 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-20 min-w-[140px]">
            <button
              onClick={handlePin}
              className="w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 text-gray-700"
            >
              {note.is_pinned ? "Unpin" : "Pin"}
            </button>
            <button
              onClick={handleDuplicate}
              className="w-full text-left text-sm px-3 py-1.5 hover:bg-gray-50 text-gray-700"
            >
              Duplicate
            </button>
            <hr className="my-1 border-gray-100" />
            <button
              onClick={handleDelete}
              className="w-full text-left text-sm px-3 py-1.5 hover:bg-red-50 text-red-600"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

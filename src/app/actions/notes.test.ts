import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { createNote, deleteNote, pinNote, duplicateNote } from "./notes";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

// ─── Mock chain builder ───────────────────────────────────────────────────────
//
// Supabase JS uses a fluent builder that is also a Promise (thenable).
// Each chainable method returns `this`; `.single()` resolves with the result;
// awaiting the chain itself also resolves with the result.
//
function makeMockChain(result: { data?: unknown; error: unknown }): any {
  const promise = Promise.resolve(result);
  const chain = {
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue(result),
    then: promise.then.bind(promise),
    catch: promise.catch.bind(promise),
    finally: promise.finally.bind(promise),
  };
  return chain;
}

const mockUser = { id: "user-abc", email: "test@example.com" };

function setupClient(chain: ReturnType<typeof makeMockChain>) {
  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    },
    from: vi.fn().mockReturnValue(chain),
  };
  (createClient as Mock).mockResolvedValue(client);
  return client;
}

function setupUnauthClient() {
  const client = {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    from: vi.fn(),
  };
  (createClient as Mock).mockResolvedValue(client);
  return client;
}

beforeEach(() => vi.clearAllMocks());

// ─── createNote ───────────────────────────────────────────────────────────────

describe("createNote", () => {
  const newNote = {
    id: "note-1",
    user_id: mockUser.id,
    title: "New Note",
    body: { type: "doc", content: [{ type: "paragraph" }] },
    body_text: "",
    is_pinned: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  it("creates a note with default title and returns it", async () => {
    const chain = makeMockChain({ data: newNote, error: null });
    setupClient(chain);

    const result = await createNote();

    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: mockUser.id,
        title: "New Note",
        is_pinned: false,
        body_text: "",
      })
    );
    expect(result.data).toEqual(newNote);
    expect(result.error).toBeNull();
  });

  it("accepts a custom title", async () => {
    const chain = makeMockChain({ data: { ...newNote, title: "My Note" }, error: null });
    setupClient(chain);

    const result = await createNote("My Note");

    expect(chain.insert).toHaveBeenCalledWith(
      expect.objectContaining({ title: "My Note" })
    );
    expect(result.data?.title).toBe("My Note");
  });

  it("returns error when not authenticated", async () => {
    setupUnauthClient();

    const result = await createNote();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Not authenticated");
  });

  it("returns error on Supabase failure", async () => {
    const chain = makeMockChain({ data: null, error: { message: "Insert failed" } });
    setupClient(chain);

    const result = await createNote();

    expect(result.data).toBeNull();
    expect(result.error).toBe("Insert failed");
  });
});

// ─── deleteNote ───────────────────────────────────────────────────────────────

describe("deleteNote", () => {
  it("soft-deletes by setting deleted_at and scopes to user", async () => {
    const chain = makeMockChain({ error: null });
    setupClient(chain);

    const result = await deleteNote("note-1");

    expect(chain.update).toHaveBeenCalledWith(
      expect.objectContaining({ deleted_at: expect.any(String) })
    );
    expect(chain.eq).toHaveBeenCalledWith("id", "note-1");
    expect(chain.eq).toHaveBeenCalledWith("user_id", mockUser.id);
    expect(result.error).toBeNull();
  });

  it("returns error when not authenticated", async () => {
    setupUnauthClient();

    const result = await deleteNote("note-1");

    expect(result.error).toBe("Not authenticated");
  });

  it("returns error on Supabase failure", async () => {
    const chain = makeMockChain({ error: { message: "Update failed" } });
    setupClient(chain);

    const result = await deleteNote("note-1");

    expect(result.error).toBe("Update failed");
  });
});

// ─── pinNote ──────────────────────────────────────────────────────────────────

describe("pinNote", () => {
  it("sets is_pinned to true and scopes to user", async () => {
    const chain = makeMockChain({ error: null });
    setupClient(chain);

    const result = await pinNote("note-1", true);

    expect(chain.update).toHaveBeenCalledWith({ is_pinned: true });
    expect(chain.eq).toHaveBeenCalledWith("user_id", mockUser.id);
    expect(result.error).toBeNull();
  });

  it("sets is_pinned to false", async () => {
    const chain = makeMockChain({ error: null });
    setupClient(chain);

    const result = await pinNote("note-1", false);

    expect(chain.update).toHaveBeenCalledWith({ is_pinned: false });
    expect(result.error).toBeNull();
  });

  it("returns error when not authenticated", async () => {
    setupUnauthClient();

    const result = await pinNote("note-1", true);

    expect(result.error).toBe("Not authenticated");
  });
});

// ─── duplicateNote ────────────────────────────────────────────────────────────

describe("duplicateNote", () => {
  const original = {
    id: "note-1",
    user_id: mockUser.id,
    title: "My Note",
    body: { type: "doc", content: [] },
    body_text: "Some content",
    is_pinned: true,
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const copy = {
    ...original,
    id: "note-2",
    title: "Copy of My Note",
    is_pinned: false,
  };

  it("creates a copy with 'Copy of' prefix and is_pinned false", async () => {
    const fetchChain = makeMockChain({ data: original, error: null });
    const insertChain = makeMockChain({ data: copy, error: null });

    const client = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
      from: vi
        .fn()
        .mockReturnValueOnce(fetchChain)
        .mockReturnValueOnce(insertChain),
    };
    (createClient as Mock).mockResolvedValue(client);

    const result = await duplicateNote("note-1");

    expect(insertChain.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Copy of My Note",
        is_pinned: false,
        user_id: mockUser.id,
      })
    );
    expect(result.data).toEqual(copy);
    expect(result.error).toBeNull();
  });

  it("returns error when original note not found", async () => {
    const fetchChain = makeMockChain({ data: null, error: { message: "Not found" } });
    setupClient(fetchChain);

    const result = await duplicateNote("note-999");

    expect(result.data).toBeNull();
    expect(result.error).toBe("Not found");
  });

  it("returns error when not authenticated", async () => {
    setupUnauthClient();

    const result = await duplicateNote("note-1");

    expect(result.error).toBe("Not authenticated");
  });
});

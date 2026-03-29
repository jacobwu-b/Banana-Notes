import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signIn, signUp, signOut } from "./auth";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
  return fd;
}

const prevState = { error: null };
const validCredentials = makeFormData({
  email: "test@example.com",
  password: "password123",
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// signIn
// ---------------------------------------------------------------------------

describe("signIn", () => {
  it("redirects to /dashboard on success", async () => {
    (createClient as Mock).mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
      },
    });

    await signIn(prevState, validCredentials);

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns error on invalid credentials", async () => {
    (createClient as Mock).mockResolvedValue({
      auth: {
        signInWithPassword: vi
          .fn()
          .mockResolvedValue({ error: { message: "Invalid login credentials" } }),
      },
    });

    const result = await signIn(prevState, validCredentials);

    expect(result.error).toBe("Invalid login credentials");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns error when email is missing", async () => {
    const result = await signIn(prevState, makeFormData({ password: "abc" }));
    expect(result.error).toBe("Email is required");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns error when password is missing", async () => {
    const result = await signIn(
      prevState,
      makeFormData({ email: "test@example.com" })
    );
    expect(result.error).toBe("Password is required");
    expect(redirect).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// signUp
// ---------------------------------------------------------------------------

describe("signUp", () => {
  it("redirects to /dashboard on success", async () => {
    (createClient as Mock).mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({ error: null }),
      },
    });

    await signUp(prevState, makeFormData({ email: "new@example.com", password: "password123" }));

    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("returns error on existing email", async () => {
    (createClient as Mock).mockResolvedValue({
      auth: {
        signUp: vi
          .fn()
          .mockResolvedValue({ error: { message: "User already registered" } }),
      },
    });

    const result = await signUp(
      prevState,
      makeFormData({ email: "existing@example.com", password: "password123" })
    );

    expect(result.error).toBe("User already registered");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns error when email is missing", async () => {
    const result = await signUp(prevState, makeFormData({ password: "abc" }));
    expect(result.error).toBe("Email is required");
    expect(redirect).not.toHaveBeenCalled();
  });

  it("returns error when password is missing", async () => {
    const result = await signUp(
      prevState,
      makeFormData({ email: "test@example.com" })
    );
    expect(result.error).toBe("Password is required");
    expect(redirect).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

describe("signOut", () => {
  it("calls supabase signOut and redirects to /login", async () => {
    const mockAuthSignOut = vi.fn().mockResolvedValue({ error: null });
    (createClient as Mock).mockResolvedValue({
      auth: { signOut: mockAuthSignOut },
    });

    await signOut();

    expect(mockAuthSignOut).toHaveBeenCalled();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});

"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "@/app/actions/auth";

const initialState = { error: null };

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <main className="min-h-screen bg-banana-cream flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-sm p-8">
        <div className="text-center mb-8">
          <span className="text-5xl" role="img" aria-label="Banana Notes">
            🍌
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">
            Banana Notes
          </h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        <form action={formAction} className="space-y-4">
          {state.error && (
            <p
              role="alert"
              className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2"
            >
              {state.error}
            </p>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-banana-yellow focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-banana-yellow focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-banana-yellow text-gray-900 font-semibold py-2.5 px-4 rounded-lg hover:brightness-95 transition-all disabled:opacity-60 mt-2"
          >
            {isPending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-gray-900 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}

"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="w-full max-w-sm space-y-4 rounded-xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold">Admin login</h1>
      <input name="username" placeholder="Username" required autoComplete="username"
        className="w-full rounded border p-3" />
      <input name="password" type="password" placeholder="Password" required
        autoComplete="current-password" className="w-full rounded border p-3" />
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button disabled={pending}
        className="w-full rounded bg-black p-3 text-white disabled:opacity-50">
        {pending ? "..." : "Login"}
      </button>
    </form>
  );
}
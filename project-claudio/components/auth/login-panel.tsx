"use client";

import { useState } from "react";
import { Apple, LogIn, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function LoginPanel() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Secure login for Project Claudio.");
  const supabase = createSupabaseBrowserClient();

  async function oauth(provider: "google" | "apple") {
    if (!supabase) {
      setStatus("Add Supabase environment keys to enable login.");
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/auth/callback" }
    });

    if (error) setStatus(error.message);
  }

  async function emailLogin() {
    if (!supabase) {
      setStatus("Add Supabase environment keys to enable email login.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" }
    });

    setStatus(error ? error.message : "Check your email for a secure sign-in link.");
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader title="Login" eyebrow="Account" />
      <div className="grid gap-3">
        <Button onClick={() => oauth("google")} className="w-full">
          <LogIn size={16} />
          Continue with Google
        </Button>
        <Button variant="secondary" onClick={() => oauth("apple")} className="w-full">
          <Apple size={16} />
          Continue with Apple
        </Button>
        <div className="grid gap-2 pt-3">
          <label className="text-sm font-medium text-muted" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="claudio@example.com"
            className="h-11 rounded-lg border border-line bg-ink/[0.03] px-3 text-sm text-ink outline-none transition focus:border-brand dark:bg-white/[0.04]"
          />
          <Button variant="secondary" onClick={emailLogin} disabled={!email}>
            <Mail size={16} />
            Email sign-in link
          </Button>
        </div>
        <p className="pt-2 text-sm leading-6 text-muted">{status}</p>
      </div>
    </Card>
  );
}

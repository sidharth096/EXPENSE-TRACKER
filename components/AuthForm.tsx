"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export function AuthForm() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const result = mode === "sign-in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });

    setSubmitting(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "sign-up") {
      setMessage("Check your email to confirm your account, then sign in.");
      setMode("sign-in");
      setPassword("");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow auth-brand"><Image src="/flow-brand.png" width={36} height={36} alt="" />Flow</span>
        <h1>{mode === "sign-in" ? "Welcome back." : "Start tracking clearly."}</h1>
        <p>{mode === "sign-in" ? "Sign in to see your private money tracker." : "Create an account. We will ask you to confirm your email first."}</p>
        <form onSubmit={submit} className="auth-form">
          <label><span>Email</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
          <label><span>Password</span><input type="password" autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {message && <p className="auth-message" role="status">{message}</p>}
          <button className="primary-button full" type="submit" disabled={submitting}>{submitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}</button>
        </form>
        <button className="text-button auth-switch" type="button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }}>
          {mode === "sign-in" ? "Need an account? Create one" : "Already confirmed? Sign in"}
        </button>
      </section>
    </main>
  );
}

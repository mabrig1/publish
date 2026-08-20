"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { backendUrl } from "@/lib/backend-url";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed.");
      const backendResponse = await fetch(backendUrl("/api/session"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      if (!backendResponse.ok) throw new Error("Frontend login succeeded, but the Express backend session could not be started.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={styles.loginShell}>
      <section className={styles.loginCard}>
        <div className={styles.loginBrand}><span className={styles.mark}>M</span> Mabrig PublishAI</div>
        <div className={styles.eyebrow}>PUBLISHER CONTROL ROOM</div>
        <h1>Admin publishing engine</h1>
        <p>This private workspace powers premium technical publishing services, manuscript diagnostics, journal strategy, and client delivery.</p>
        <form className={styles.loginForm} onSubmit={submit}>
          <label>
            Admin access key
            <input type="password" value={key} onChange={(event) => setKey(event.target.value)} autoComplete="current-password" required />
          </label>
          <button className={styles.primary} disabled={loading}>{loading ? "Signing in…" : "Enter publishing engine"}</button>
        </form>
        {error && <div className={styles.error}>{error}</div>}
        <p className={styles.note}>The access key is validated on the server and is never embedded in the browser bundle.</p>
      </section>
    </main>
  );
}

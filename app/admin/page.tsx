import { redirect } from "next/navigation";
import { adminAuthConfigured, hasAdminSession } from "@/lib/admin-auth";
import AdminClient from "./AdminClient";
import styles from "./admin.module.css";

export default async function AdminPage() {
  if (!adminAuthConfigured()) {
    return (
      <main className={styles.shell}>
        <section className={styles.setup}>
          <div className={styles.eyebrow}>ADMIN SETUP REQUIRED</div>
          <h1>Protect the publishing engine</h1>
          <p className={styles.muted}>Set a strong server-side admin key in your deployment environment, then redeploy. The public website will remain available while the publisher workspace stays private.</p>
          <code>ADMIN_ACCESS_KEY=your-long-random-secret</code>
        </section>
      </main>
    );
  }

  if (!(await hasAdminSession())) redirect("/admin/login");
  return <AdminClient />;
}

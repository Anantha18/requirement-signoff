"use client";

import { FormEvent, useState } from "react";
import { useAction } from "convex/react";
import type { Doc } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import styles from "./leads.module.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const label = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function LeadsViewer() {
  const listLeads = useAction(api.leads.listProtected);
  const [password, setPassword] = useState("");
  const [leads, setLeads] = useState<Doc<"leads">[] | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || state === "loading") return;
    setState("loading");
    setMessage("");
    try {
      const rows = await listLeads({ password });
      setLeads(rows);
      setPassword("");
      setState("idle");
    } catch (caught) {
      const rawMessage = caught instanceof Error ? caught.message : "";
      setLeads(null);
      setState("error");
      setMessage(rawMessage.includes("not configured")
        ? "Lead access is not configured yet."
        : "That password is incorrect.");
    }
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <p>Room configurator</p>
      <h1>Lead register</h1>
      <span>Completed room briefs and their indicative equipment budgets.</span>
    </header>

    {leads === null ? <section className={styles.gate} aria-labelledby="gate-title">
      <div className={styles.lock} aria-hidden="true">•••</div>
      <h2 id="gate-title">Protected access</h2>
      <p>Enter the lead-register password to view customer details.</p>
      <form onSubmit={unlock}>
        <label htmlFor="leads-password">Password</label>
        <input id="leads-password" type="password" autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setMessage(""); setState("idle"); }}/>
        <button type="submit" disabled={!password || state === "loading"}>{state === "loading" ? "Checking…" : "View leads"}</button>
      </form>
      {message ? <p className={styles.error} role="alert">{message}</p> : null}
    </section> : <section className={styles.register} aria-live="polite">
      <div className={styles.registerHead}>
        <div><span>Captured leads</span><strong>{leads.length}</strong></div>
        <p>Newest first</p>
      </div>

      {leads.length === 0 ? <div className={styles.empty}><h2>No leads yet</h2><p>A completed configurator request will appear here.</p></div> : <div className={styles.leadList}>
        {leads.map((lead) => <details className={styles.lead} key={lead._id}>
          <summary>
            <span className={styles.email}>{lead.email}</span>
            <span>{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(lead.createdAt)}</span>
            <span>{lead.configuration.lengthFt} × {lead.configuration.widthFt} ft · {lead.configuration.seats} seats</span>
            <strong>{money.format(lead.totalLow)} – {money.format(lead.totalHigh)}</strong>
          </summary>
          <div className={styles.leadBody}>
            <dl className={styles.configuration}>
              <div><dt>Company</dt><dd>{lead.configuration.companyName || "Not provided"}</dd></div>
              <div><dt>Contact</dt><dd>{lead.configuration.contactNumber || "Not provided"}</dd></div>
              <div><dt>Platform</dt><dd>{label(lead.configuration.platform)}</dd></div>
              <div><dt>Deployment</dt><dd>{lead.configuration.deployment === "not_sure" ? "To be decided on site visit" : label(lead.configuration.deployment)}</dd></div>
              <div><dt>Support</dt><dd>{label(lead.supportLevel)}</dd></div>
              <div><dt>Mode</dt><dd>{label(lead.configuration.mode)}</dd></div>
            </dl>
            <div className={styles.bom}>
              <div className={styles.bomHead}><span>Item</span><span>Category</span><span>Qty</span><span>Indicative range</span></div>
              {lead.bom.map((item, index) => <div className={styles.bomRow} key={`${item.name}-${index}`}>
                <strong>{item.name}{item.optional ? <em>Optional</em> : null}</strong>
                <span>{item.category}</span>
                <span>{item.quantity}</span>
                <span>{item.low !== undefined && item.high !== undefined ? `${money.format(item.low)} – ${money.format(item.high)}` : "To be confirmed"}</span>
              </div>)}
            </div>
          </div>
        </details>)}
      </div>}
    </section>}
  </main>;
}

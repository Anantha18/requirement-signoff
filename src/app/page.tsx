"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { RoomMode, RoomConfiguration } from "../../convex/configurator";
import styles from "./page.module.css";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function Home() {
  const createConfiguration = useMutation(api.configurations.create);
  const [result, setResult] = useState<RoomConfiguration | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await createConfiguration({
        lengthFt: Number(data.get("lengthFt")), widthFt: Number(data.get("widthFt")),
        seats: Number(data.get("seats")), mode: data.get("mode") as RoomMode, email: String(data.get("email")),
      });
      setResult(response);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We could not create this BOM. Please try again.");
    } finally { setLoading(false); }
  }

  return <main className={styles.shell}>
    <header className={styles.header}><div className={styles.mark} aria-hidden="true"><span/><span/><span/></div><p className={styles.productName}>Room BOM Planner</p><span className={styles.status}>Indicative AV planning</span></header>
    <section className={styles.workspace}>
      <div className={styles.intro}><div><p className={styles.eyebrow}>Meeting room configurator</p><h1>Size the room.<br/>See the AV budget.</h1></div><p>Enter the basics and get a practical equipment starting point in about two minutes.</p></div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formHeading}><span>01</span><div><h2>Room details</h2><p>One room per estimate</p></div></div>
        <div className={styles.dimensionGrid}>
          <label>Room length <span>feet</span><input name="lengthFt" type="number" min="6" max="60" step="0.5" placeholder="20" required/></label>
          <label>Room width <span>feet</span><input name="widthFt" type="number" min="6" max="60" step="0.5" placeholder="14" required/></label>
        </div>
        <label>Number of seats<input name="seats" type="number" min="1" max="32" step="1" placeholder="10" required/></label>
        <fieldset><legend>How will calls start?</legend>
          <label className={styles.choice}><input type="radio" name="mode" value="native" defaultChecked/><span><strong>Native room system</strong><small>Start meetings from a room controller</small></span></label>
          <label className={styles.choice}><input type="radio" name="mode" value="byod"/><span><strong>BYOD</strong><small>Bring your own laptop and connect</small></span></label>
        </fieldset>
        <label>Email <span>required</span><input name="email" type="email" autoComplete="email" placeholder="you@company.com" required/></label>
        <button type="submit" disabled={loading}>{loading ? "Building your BOM…" : "Build my room BOM"}<span aria-hidden="true">→</span></button>
        {error && <p className={styles.error} role="alert">{error}</p>}
      </form>
      {result && <section className={styles.result} aria-live="polite">
        <div className={styles.resultHeading}><div><p className={styles.eyebrow}>02 · Indicative BOM</p><h2>{result.tier[0].toUpperCase()+result.tier.slice(1)} room · {result.areaSqFt} sq ft</h2></div><div className={styles.total}><span>Total budget band</span><strong>{money.format(result.totalLow)} – {money.format(result.totalHigh)}</strong></div></div>
        <div className={styles.tableWrap}><table><thead><tr><th>Item</th><th>Category</th><th>Qty</th><th>Indicative range</th></tr></thead><tbody>{result.items.map(item=><tr key={item.name}><td>{item.name}</td><td>{item.category}</td><td>{item.quantity}</td><td>{money.format(item.low)} – {money.format(item.high)}</td></tr>)}</tbody></table></div>
        <p className={styles.disclaimer}>Planning estimate only. Prices exclude tax and can vary by brand, availability, room conditions and installation.</p>
      </section>}
    </section>
    <footer className={styles.footer}><span>GrowthX Build Week · Season 03</span><span>One room. One working budget band.</span></footer>
  </main>;
}

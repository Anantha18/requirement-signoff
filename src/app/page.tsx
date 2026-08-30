"use client";

import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  configureRoom,
  type RoomMode,
  type RoomConfiguration,
} from "../../convex/configurator";
import styles from "./page.module.css";

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const exampleResult = configureRoom({
  lengthFt: 20,
  widthFt: 14,
  seats: 10,
  mode: "native",
});

type RoomInputs = {
  lengthFt: number;
  widthFt: number;
  seats: number;
  mode: RoomMode;
  companyName: string;
  contactNumber: string;
};

function BomTable({ result }: { result: RoomConfiguration }) {
  return (
    <>
      <div className={styles.tableWrap}>
        <table>
          <thead>
            <tr>
              <th>Item</th><th>Category</th><th>Qty</th><th>Indicative range</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((item) => (
              <tr key={item.name}>
                <td data-label="Item">{item.name}</td><td data-label="Category">{item.category}</td><td data-label="Qty">{item.quantity}</td>
                <td data-label="Indicative range">{money.format(item.low)} – {money.format(item.high)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.budgetLine}>
        <span>Total budget band</span>
        <strong>{money.format(result.totalLow)} – {money.format(result.totalHigh)}</strong>
      </div>
    </>
  );
}

export default function Home() {
  const createConfiguration = useMutation(api.configurations.create);
  const [roomInputs, setRoomInputs] = useState<RoomInputs | null>(null);
  const [result, setResult] = useState<RoomConfiguration | null>(null);
  const [sendError, setSendError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function handleRoomSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const inputs: RoomInputs = {
      lengthFt: Number(data.get("lengthFt")),
      widthFt: Number(data.get("widthFt")),
      seats: Number(data.get("seats")),
      mode: data.get("mode") as RoomMode,
      companyName: String(data.get("companyName") || ""),
      contactNumber: String(data.get("contactNumber") || ""),
    };

    setRoomInputs(inputs);
    setResult(configureRoom(inputs));
    setSendError("");
    setSent(false);
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roomInputs) return;

    setSendError("");
    setSending(true);
    const data = new FormData(event.currentTarget);
    try {
      await createConfiguration({
        ...roomInputs,
        email: String(data.get("email")),
      });
      setSent(true);
    } catch (caught) {
      setSendError(caught instanceof Error ? caught.message : "We could not save this list. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.mark} aria-hidden="true"><span/><span/><span/></div>
        <p className={styles.productName}>VIDEO CONFERENCING - ROOM CONFIGURATOR</p>
      </header>

      <section className={styles.workspace}>
        <div className={styles.intro}>
          <div><p className={styles.eyebrow}>Meeting room configurator</p><h1>Size the room.<br/>See the AV budget.</h1></div>
          <p>Enter the basics and get a practical equipment starting point in about two minutes.</p>
        </div>

        <section className={styles.example}>
          <div className={styles.exampleHeading}>
            <div><p className={styles.eyebrow}>Worked example</p><h2>Example: a 10-seat room</h2></div>
            <p>20 × 14 ft · Native room system · {exampleResult.displaySizeInches}-inch display</p>
          </div>
          <BomTable result={exampleResult}/>
          <p className={styles.disclaimer}>This example is calculated by the same rules used for every visitor result.</p>
        </section>

        <form className={styles.form} onSubmit={handleRoomSubmit}>
          <div className={styles.formHeading}><span>01</span><div><h2>Room details</h2><p>No email needed to see your estimate</p></div></div>
          <div className={styles.dimensionGrid}>
            <label>Room length <span>feet</span><input name="lengthFt" type="number" min="6" max="60" step="0.5" placeholder="20" required/></label>
            <label>Room width <span>feet</span><input name="widthFt" type="number" min="6" max="60" step="0.5" placeholder="14" required/></label>
          </div>
          <label>Number of seats<input name="seats" type="number" min="1" max="32" step="1" placeholder="10" required/></label>
          <fieldset><legend>How will calls start?</legend>
            <label className={styles.choice}><input type="radio" name="mode" value="native" defaultChecked/><span><strong>Native room system</strong><small>Start meetings from a room controller</small></span></label>
            <label className={styles.choice}><input type="radio" name="mode" value="byod"/><span><strong>BYOD</strong><small>Bring your own laptop and connect</small></span></label>
          </fieldset>
          <label>Company name <span>optional</span><input name="companyName" type="text" autoComplete="organization" maxLength={120} placeholder="Company or organisation"/></label>
          <label>Contact number <span>optional</span><input name="contactNumber" type="tel" autoComplete="tel" inputMode="tel" placeholder="+91 98765 43210"/></label>
          <button type="submit">Build my room BOM<span aria-hidden="true">→</span></button>
        </form>

        {result && (
          <section className={styles.result} aria-live="polite">
            <div className={styles.resultHeading}>
              <div><p className={styles.eyebrow}>02 · Your indicative BOM</p><h2>{result.tier[0].toUpperCase()+result.tier.slice(1)} room · {result.areaSqFt} sq ft</h2><p className={styles.displayRule}>Recommended display: <strong>{result.displaySizeInches} inches</strong> · Epson 6× presentation viewing rule</p></div>
            </div>
            <BomTable result={result}/>
            <p className={styles.disclaimer}>Planning estimate only. Prices exclude tax and can vary by brand, availability, room conditions and installation.</p>
            <form className={styles.emailForm} onSubmit={handleEmailSubmit}>
              <label htmlFor="result-email">Email me this list</label>
              <div><input id="result-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" required/><button type="submit" disabled={sending}>{sending ? "Sending…" : "Send"}</button></div>
              {sent && <p className={styles.success} role="status">Your email and room list have been saved.</p>}
              {sendError && <p className={styles.error} role="alert">{sendError}</p>}
            </form>
          </section>
        )}
      </section>
      <footer className={styles.footer}><span>GrowthX Build Week · Season 03</span><span>One room. One working budget band.</span></footer>
    </main>
  );
}

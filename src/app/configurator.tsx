"use client";

import { FormEvent, useMemo, useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { configureRoom, type RoomMode } from "../../convex/configurator";
import {
  coreEquipment,
  optionalDevices,
  recommendSupport,
  requiredAccessories,
  supportLevelCopy,
  supportQuestions,
  type Deployment,
  type OptionalDeviceId,
  type Platform,
  type SupportAnswers,
  type SupportLevel,
} from "./configurator-data";
import styles from "./page.module.css";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const steps = ["Room", "Platform", "Deployment", "Core equipment", "Accessories", "Additional devices", "Support & AMC", "Final recommendation"];
const platformLabels: Record<Platform, string> = { microsoft_teams: "Microsoft Teams", zoom: "Zoom", google_meet: "Google Meet", byod: "BYOD" };
const deploymentLabels: Record<Deployment, string> = { appliance: "Appliance-based", pc: "PC-based", byod: "User laptop (BYOD)" };
const deviceNames = Object.fromEntries(optionalDevices.map((device) => [device.id, device.name]));

const initialSupport: SupportAnswers = {
  qualifiedSupport: "yes",
  operationalSupport: "self_managed",
  troubleshooting: "customer",
  supportHours: "business",
  replacementTime: "48_hours",
};

function ChoiceCard({ name, value, selected, title, description, onChange }: { name: string; value: string; selected: boolean; title: string; description?: string; onChange: () => void }) {
  return <label className={`${styles.choiceCard} ${selected ? styles.selected : ""}`}>
    <input type="radio" name={name} value={value} checked={selected} onChange={onChange}/>
    <span className={styles.choiceMark} aria-hidden="true"/>
    <span><strong>{title}</strong>{description ? <small>{description}</small> : null}</span>
  </label>;
}

function Price({ low, high }: { low: number; high: number }) {
  return <>{money.format(low)} – {money.format(high)}</>;
}

export function Configurator() {
  const sendBom = useAction(api.emails.sendBom);
  const [step, setStep] = useState(0);
  const [supportQuestion, setSupportQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lengthFt, setLengthFt] = useState(20);
  const [widthFt, setWidthFt] = useState(14);
  const [seats, setSeats] = useState(10);
  const [platform, setPlatform] = useState<Platform>("microsoft_teams");
  const [deployment, setDeployment] = useState<Deployment>("appliance");
  const [accessories, setAccessories] = useState<string[]>([]);
  const [devices, setDevices] = useState<OptionalDeviceId[]>([]);
  const [supportAnswers, setSupportAnswers] = useState<SupportAnswers>(initialSupport);
  const [supportLevel, setSupportLevel] = useState<SupportLevel>("low");
  const [emailState, setEmailState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");

  const mode: RoomMode = platform === "byod" ? "byod" : "native";
  const result = useMemo(() => configureRoom({ lengthFt, widthFt, seats, mode }), [lengthFt, widthFt, seats, mode]);
  const roomTierText = result.tier === "small" ? "Small room" : result.tier === "medium" ? "Medium room" : "Large room";
  const core = coreEquipment(result);
  const required = requiredAccessories(result);

  function goNext() {
    if (step === 2) setAccessories(required.map((item) => item.name));
    if (step === 6) {
      if (supportQuestion < supportQuestions.length - 1) { setSupportQuestion((value) => value + 1); return; }
      setSupportLevel(recommendSupport(supportAnswers).level);
      setLoading(true);
      window.setTimeout(() => { setLoading(false); setStep(7); }, 900);
      return;
    }
    setStep((value) => Math.min(7, value + 1));
  }

  function goBack() {
    if (step === 6 && supportQuestion > 0) { setSupportQuestion((value) => value - 1); return; }
    if (step === 7) { setStep(6); setSupportQuestion(4); return; }
    setStep((value) => Math.max(0, value - 1));
  }

  function toggleDevice(id: OptionalDeviceId) {
    setDevices((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function handleEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (emailState === "sending" || emailState === "sent") return;
    const data = new FormData(event.currentTarget);
    setEmailState("sending"); setEmailMessage("");
    try {
      await sendBom({
        email: String(data.get("email")), companyName: String(data.get("companyName") || ""), contactNumber: String(data.get("contactNumber") || ""),
        lengthFt, widthFt, seats, mode, platform, deployment, selectedAccessories: accessories,
        additionalDevices: devices.map((id) => deviceNames[id]), supportAnswers, supportLevel,
      });
      setEmailState("sent"); setEmailMessage("Resend accepted the message. Check your inbox.");
    } catch (caught) {
      const rawMessage = caught instanceof Error ? caught.message : "";
      const clearMessage = rawMessage.includes("not configured")
        ? "Email delivery is not configured yet. Add the Resend settings and try again."
        : rawMessage.includes("valid email")
          ? "Enter a valid email address."
          : "The email provider did not accept the message. Try again or use another address.";
      setEmailState("error"); setEmailMessage(clearMessage);
    }
  }

  return <>
    <nav className={styles.progress} aria-label="Configurator progress">
      <ol>{steps.map((label, index) => <li key={label} className={index === step ? styles.current : index < step ? styles.complete : ""}><span>{index + 1}</span><small>{label}</small></li>)}</ol>
    </nav>

    <section className={styles.configuratorPanel}>
      <div className={styles.stepMeta}><span>Step {step + 1} of 8</span>{step === 6 ? <span>Support question {supportQuestion + 1} of 5</span> : null}</div>

      {step === 0 ? <div className={styles.stepContent}>
        <div className={styles.stepHeading}><p className={styles.eyebrow}>Room</p><h2>Start with the room itself.</h2><p>Dimensions and seats determine the current BOM size band.</p></div>
        <div className={styles.inputGrid}>
          <label>Length <span>feet</span><input type="number" min="6" max="60" step="0.5" value={lengthFt} onChange={(e) => setLengthFt(Number(e.target.value))}/></label>
          <label>Width <span>feet</span><input type="number" min="6" max="60" step="0.5" value={widthFt} onChange={(e) => setWidthFt(Number(e.target.value))}/></label>
          <label>Seating capacity <span>people</span><input type="number" min="1" max="32" step="1" value={seats} onChange={(e) => setSeats(Number(e.target.value))}/></label>
        </div>
        <div className={styles.roomCards}>{["small", "medium", "large"].map((tier) => <div key={tier} className={`${styles.roomCard} ${result.tier === tier ? styles.activeRoom : ""}`}><strong>{tier[0].toUpperCase()+tier.slice(1)}</strong><span>{tier === "small" ? "Up to 180 sq ft and 6 seats" : tier === "medium" ? "Up to 350 sq ft and 14 seats" : "Above either medium-room limit"}</span></div>)}</div>
        <p className={styles.detected}><span/>Detected: <strong>{roomTierText}</strong> · {result.areaSqFt} sq ft</p>
      </div> : null}

      {step === 1 ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Platform</p><h2>How will the room join calls?</h2><p>This records the meeting platform. The existing BOM changes only between Native and BYOD.</p></div><div className={styles.cardGrid}>{(["microsoft_teams","zoom","google_meet","byod"] as Platform[]).map((value) => <ChoiceCard key={value} name="platform" value={value} selected={platform===value} title={platformLabels[value]} description={value === "byod" ? "People connect their own laptop." : "A native room experience; exact compatibility is To be confirmed."} onChange={() => { setPlatform(value); setDeployment(value === "byod" ? "byod" : deployment === "byod" ? "appliance" : deployment); }}/>)}</div></div> : null}

      {step === 2 ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Deployment</p><h2>What will run the room?</h2><p>Choose the operating approach. Exact product compatibility is To be confirmed.</p></div>{platform === "byod" ? <div className={styles.infoBox}><strong>User laptop selected</strong><p>BYOD uses the visitor’s laptop, so a separate appliance or room PC is not selected.</p></div> : <div className={styles.cardGrid}><ChoiceCard name="deployment" value="appliance" selected={deployment==="appliance"} title="Appliance-based system" description="A dedicated room device runs meetings. It is simpler to operate and has fewer PC maintenance tasks." onChange={()=>setDeployment("appliance")}/><ChoiceCard name="deployment" value="pc" selected={deployment==="pc"} title="PC-based system" description="A room computer runs meetings. It can offer more flexibility but needs normal PC administration." onChange={()=>setDeployment("pc")}/></div>}</div> : null}

      {step === 3 ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Core equipment</p><h2>What the current BOM recommends.</h2><p>No new products or compatibility assumptions have been added.</p></div><div className={styles.equipmentList}>{core.map(({role,item})=><div key={role}><span>{role}</span>{item ? <><strong>{item.name}</strong><small>Qty {item.quantity} · <Price low={item.low} high={item.high}/></small></> : <><strong>To be confirmed</strong><small>No separate {role.toLowerCase()} item exists in the current BOM.</small></>}</div>)}</div></div> : null}

      {step === 4 ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Accessories</p><h2>Required connection and installation items.</h2><p>Only accessories already present in the BOM are preselected. Additional compatibility data is missing.</p></div><div className={styles.checkList}>{required.map((item)=><label key={item.name}><input type="checkbox" checked={accessories.includes(item.name)} disabled/><span><strong>{item.name} <em>Required</em></strong><small>Existing BOM item · Qty {item.quantity} · <Price low={item.low} high={item.high}/></small></span></label>)}</div>{required.length===0?<div className={styles.infoBox}>Compatible mounts, cables and accessories: <strong>To be confirmed</strong></div>:null}</div> : null}

      {step === 5 ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Additional devices</p><h2>Add optional room capabilities.</h2><p>These categories were requested, but products, compatibility and prices are To be confirmed.</p></div><div className={styles.checkList}>{optionalDevices.map((device)=><label key={device.id}><input type="checkbox" checked={devices.includes(device.id)} onChange={()=>toggleDevice(device.id)}/><span><strong>{device.name} <em>Optional</em></strong><small>{device.description} · Price and compatibility: To be confirmed</small></span></label>)}</div></div> : null}

      {step === 6 ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Support & AMC</p><h2>{supportQuestions[supportQuestion].title}</h2><p>One answer at a time helps set the required coverage level. Commercial AMC plan names and prices are To be confirmed.</p></div><div className={styles.cardGrid}>{supportQuestions[supportQuestion].options.map(([value,label])=><ChoiceCard key={value} name={supportQuestions[supportQuestion].key} value={value} selected={supportAnswers[supportQuestions[supportQuestion].key]===value} title={label} onChange={()=>setSupportAnswers((current)=>({...current,[supportQuestions[supportQuestion].key]:value}))}/>)}</div>{supportQuestion===4?<div className={styles.recommendPreview}><span>Likely recommendation</span><strong>{supportLevelCopy[recommendSupport(supportAnswers).level].label}</strong><p>{recommendSupport(supportAnswers).reason}</p></div>:null}</div> : null}

      {loading ? <div className={styles.loading} role="status"><span/><strong>Building the complete recommendation…</strong><p>Checking the current BOM, selections and support answers.</p></div> : null}

      {step === 7 && !loading ? <div className={styles.stepContent}><div className={styles.stepHeading}><p className={styles.eyebrow}>Final recommendation</p><h2>{roomTierText} · {platformLabels[platform]}</h2><p>Indicative only. Unknown product, compatibility, support and price data remains clearly marked.</p></div>
        <div className={styles.summaryStrip}><div><span>Room</span><strong>{lengthFt} × {widthFt} ft · {seats} seats</strong></div><div><span>Deployment</span><strong>{deploymentLabels[deployment]}</strong></div><div><span>Display</span><strong>{result.displaySizeInches} inches</strong></div></div>
        <div className={styles.finalTable}><div className={styles.finalHead}><span>Item</span><span>Category</span><span>Qty</span><span>Indicative range</span></div>{result.items.map((item)=><div className={styles.finalRow} key={item.name}><strong>{item.name}</strong><span>{item.category}</span><span>{item.quantity}</span><span><Price low={item.low} high={item.high}/></span></div>)}{devices.map((id)=><div className={styles.finalRow} key={id}><strong>{deviceNames[id]} <em>Optional</em></strong><span>Additional device</span><span>1</span><span>To be confirmed</span></div>)}</div>
        <div className={styles.budget}><span>Indicative priced-item budget</span><strong><Price low={result.totalLow} high={result.totalHigh}/></strong><small>Excludes optional devices, support, tax and any item marked To be confirmed.</small></div>
        <div className={styles.supportPick}><div><span>Recommended support coverage</span><strong>{supportLevelCopy[recommendSupport(supportAnswers).level].label}</strong><p>{recommendSupport(supportAnswers).reason}</p></div><fieldset><legend>Choose another coverage level</legend>{(["low","medium","high"] as SupportLevel[]).map((level)=><label key={level}><input type="radio" name="supportLevel" checked={supportLevel===level} onChange={()=>setSupportLevel(level)}/>{supportLevelCopy[level].label}</label>)}</fieldset><small>{supportLevelCopy[supportLevel].description}</small></div>
        <form className={styles.emailForm} onSubmit={handleEmail}><div className={styles.emailHeading}><span>09 · Email the BOM</span><h3>Send this complete recommendation</h3><p>Success appears only after the email provider accepts it.</p></div><div className={styles.contactGrid}><label>Email <input name="email" type="email" autoComplete="email" required placeholder="you@company.com"/></label><label>Company <span>optional</span><input name="companyName" autoComplete="organization"/></label><label>Contact number <span>optional</span><input name="contactNumber" type="tel" autoComplete="tel"/></label></div><button type="submit" disabled={emailState==="sending"||emailState==="sent"}>{emailState==="sending"?"Sending…":emailState==="sent"?"Sent":"Email me this BOM"}</button>{emailMessage?<p className={emailState==="sent"?styles.success:styles.error} role="status">{emailMessage}</p>:null}</form>
      </div> : null}

      {!loading ? <div className={styles.controls}><button type="button" className={styles.back} onClick={goBack} disabled={step===0}>Back</button>{step<7?<button type="button" className={styles.next} onClick={goNext}>{step===6&&supportQuestion===4?"Build recommendation":"Next"}<span aria-hidden="true">→</span></button>:null}</div> : null}
    </section>
  </>;
}

import { configureRoom } from "../../convex/configurator";
import { Configurator } from "./configurator";
import styles from "./page.module.css";

const sample = configureRoom({ lengthFt: 20, widthFt: 14, seats: 10, mode: "native" });
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export default function Home() {
  return <main>
    <header className={styles.hero}><div className={styles.powerMark} aria-hidden="true"><i/><i/></div><div className={styles.heroInner}><p className={styles.kicker}>Power Bridge · AV & IT Expert</p><h1>Video conferencing.<br/><span>Decoded</span> for your room.</h1><p>Configure one practical meeting-room system from room size to support coverage, using the current project BOM.</p></div></header>
    <section className={styles.main}>
      <details className={styles.sample}><summary><span><b>Worked example</b>Example: a 10-seat room</span><strong>{money.format(sample.totalLow)} – {money.format(sample.totalHigh)}</strong></summary><div className={styles.sampleBody}><p>20 × 14 ft · Native room system · {sample.displaySizeInches}-inch display</p>{sample.items.map((item)=><div key={item.name}><strong>{item.name}</strong><span>{item.category}</span><span>Qty {item.quantity}</span><span>{money.format(item.low)} – {money.format(item.high)}</span></div>)}<small>Calculated with the same existing BOM function used by the configurator.</small></div></details>
      <Configurator/>
    </section>
    <footer className={styles.footer}><span>POWER BRIDGE</span><span>Indicative AV planning · GrowthX Build Week S03</span></footer>
  </main>;
}

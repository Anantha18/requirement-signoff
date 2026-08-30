import { Configurator } from "./configurator";
import styles from "./page.module.css";

export default function Home() {
  return <main>
    <header className={styles.hero}><div className={styles.heroInner}><h1>Video conferencing.<br/><span>Decoded</span> for your room.</h1><p>Configure one practical meeting-room system from room size to support coverage, using the current project BOM.</p></div></header>
    <section className={styles.main}>
      <Configurator/>
    </section>
    <footer className={styles.footer}><span>Indicative AV planning · GrowthX Build Week S03</span></footer>
  </main>;
}

import Image from "next/image";
import { Configurator } from "./configurator";
import styles from "./page.module.css";

export default function Home() {
  return <main>
    <header className={styles.hero}>
      <Image className={styles.heroImage} src="/hero-room.jpg" alt="A Power Bridge boardroom installation" fill sizes="100vw" preload/>
      <div className={styles.heroInner}>
        <h1>Video conferencing.<br/><span>Decoded</span> for your room.</h1>
        <p>Configure one practical meeting-room system from room size to support coverage, using the current project BOM.</p>
        <a className={styles.heroCta} href="#configurator">Start with the room <span aria-hidden="true">→</span></a>
      </div>
      <p className={styles.heroCaption}>A Power Bridge install.</p>
    </header>
    <section className={styles.main} id="configurator">
      <Configurator/>
    </section>
    <footer className={styles.footer}><span>Indicative AV planning · GrowthX Build Week S03</span></footer>
  </main>;
}

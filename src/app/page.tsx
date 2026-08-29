import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.mark} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className={styles.productName}>Requirement Sign-off</p>
        <span className={styles.status}>M0 · Live shell</span>
      </header>

      <section className={styles.workspace}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>AV discovery, before the BOM</p>
          <h1>Agree on the room before choosing the equipment.</h1>
          <p className={styles.summary}>
            A guided requirement brief for IT and facilities teams planning one
            meeting room.
          </p>
        </div>

        <div className={styles.signalPath} aria-label="Product workflow">
          <div>
            <span>01</span>
            <strong>Answer</strong>
            <p>Eight questions that affect AV selection.</p>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>02</span>
            <strong>Review</strong>
            <p>See agreed needs and unresolved decisions.</p>
          </div>
          <i aria-hidden="true" />
          <div>
            <span>03</span>
            <strong>Approve</strong>
            <p>Lock the brief before BOM preparation.</p>
          </div>
        </div>

        <aside className={styles.notice}>
          <span className={styles.pulse} aria-hidden="true" />
          <div>
            <strong>Build in progress</strong>
            <p>The complete guided flow ships Sunday night.</p>
          </div>
        </aside>
      </section>

      <footer className={styles.footer}>
        <span>GrowthX Build Week · Season 03</span>
        <span>One room. One agreed brief.</span>
      </footer>
    </main>
  );
}

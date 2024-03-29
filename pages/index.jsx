import Link from "next/link";
import Illustration from "../components/Illustration";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.background}>
          <h1>I BUILD</h1>
          <h1>WEBSITES</h1>
        </div>
        <div className={styles.foreground}>
          <div className={styles.content}>
            <h1 className={styles.name}>SHAMIRUL ISLAM</h1>
            <h6 className={styles.bio}>Frontend Developer</h6>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
                position: "relative",
                zIndex: "999",
              }}
            >
              <Link href="/projects">
                <button className={styles.button}>View Work</button>
              </Link>
              <Link href="/contact">
                <button className={styles.outlined}>Contact Me</button>
              </Link>
              <Link
                href="https://drive.google.com/file/d/1rmyaWqfeFWDCF_7pKBcluA-Kg9tscLDK/view?usp=drive_link"
                target="_blank"
              >
                <button className={styles.button}>Resume</button>
              </Link>
            </div>
          </div>
          <Illustration className={styles.illustration} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { title: "Home" },
  };
}

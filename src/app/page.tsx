import LangflowLogo from "../../components/LangflowLogo";
import ImageUploadWrapper from "../../components/ImageUploadWrapper";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>AI alt text generator</h1>
      </header>
      <main className={styles.main}>
        <ImageUploadWrapper />
      </main>
      <footer className={styles.footer}>
        <a
          href="https://langflow.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>built with</span> <LangflowLogo></LangflowLogo>
        </a>
      </footer>
    </div>
  );
}

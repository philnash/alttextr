import LangflowLogo from "../../components/LangflowLogo";
import ImageUploadWrapper from "../../components/ImageUploadWrapper";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>AI alt text generator</h1>
        <p>
          This tool is powered by{" "}
          <a className={styles.primary} href="https://www.langflow.org/">
            Langflow
          </a>{" "}
          and{" "}
          <a
            className={styles.primary}
            href="https://platform.openai.com/docs/models/gpt-4o-mini"
          >
            OpenAI gpt-4.0-mini
          </a>{" "}
          and can help you come up with ideas for the alt text of an image.
          Remember that you are responsible for the text you use on a web page.
        </p>
        <p>
          Alt text should be concise, descriptive, and tailored to the
          image&apos;s context and function. Use clear language to convey
          essential information and omit redundant phrases.
        </p>
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

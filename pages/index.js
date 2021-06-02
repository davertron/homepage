import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

export default function Home() {
  return (
    <>
      <Head>
        <title>davertron.com</title>
        <meta name="description" content="Personal Homepage for Dave Davis" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />

        <GoogleAnalytics />
      </Head>

      <div className={styles.container}>
        <h1>Dave Davis</h1>
        <p>Front-End Developer. JavaScript Jockey. React Wrangler. Dork Dad.</p>
        <ul className={styles.links}>
          <li>
            <a target="_blank" href="/resume">
              Resume
            </a>
          </li>
          <li>
            <a target="_blank" href="/github">
              Github
            </a>
          </li>
          <li>
            <a target="_blank" href="/linkedin">
              LinkedIn
            </a>
          </li>
          <li>
            <a target="_blank" href="/hn">
              Hacker News
            </a>
          </li>
          <li>
            <a target="_blank" href="/twitter">
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

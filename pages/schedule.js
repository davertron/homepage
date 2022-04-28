
import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleAnalytics from "../components/GoogleAnalytics";

export default function Home() {
  return (
    <>
      <Head>
        <title>davertron.com | Ice Pack Games</title>
        <meta name="description" content="Personal Homepage for Dave Davis" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />

        <GoogleAnalytics />
      </Head>

      <div className={styles.scheduleContainer}>
        <h1>Ice Pack Games</h1>
        <iframe
          className={styles.observableEmbed}
          width="100%"
          height="166"
          frameBorder="0"
          src="https://observablehq.com/embed/813b6aed1deb9508?cells=viewof+schedule"
        ></iframe>
      </div>
    </>
  );
}

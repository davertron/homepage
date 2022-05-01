import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { useState } from "react";

import axios from "axios";
import { load } from "cheerio";

export async function getServerSideProps({ req, res }) {
  // Set caching headers to cache this for 8 hours...the values on the Full
  // stride site should not be changing very frequently...
  const eightHoursInSeconds = 8 * 60 * 60;
  res.setHeader("Cache-Control", `public, s-maxage=${eightHoursInSeconds}`);
  const games = [];
  try {
    const response = await axios
      .get(
        "http://fullstridestaging.com/schedule_nf.php?league=1&programme_abbr=SRC",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36",
          },
        }
      )
      .then((r) => r.data);

    const $ = load(response);

    const $scheduleRows = $(
      "body > font > table > tbody > tr:nth-child(4) > td > table > tbody > tr"
    );

    $scheduleRows.each((index, row) => {
      if (index !== 0) {
        const tds = $(row).find("td");
        const game = {
          Date: $(tds[0]).text(),
          Rink: $(tds[1]).text(),
          Teams: $(tds[3])
            .text()
            .replace(/\n/, "")
            .split(/\n/)
            .map((t) => t.trim()),
        };
        games.push(game);
      }
    });
  } catch (e) {
    console.error(e);
  }
  return { props: { games } };
}

export default function IcePack({ games }) {
  const [onlyIcePackGames, setOnlyIcePackGames] = useState(true);

  const icePackGames = games.filter((g) => g.Teams.includes("Ice Pack"));

  if (onlyIcePackGames) {
    games = icePackGames;
  }
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
        <div style={{ fontSize: 16, textAlign: "left" }}>
          <label style={{ marginRight: 8 }}>Only Ice Pack:</label>
          <input
            type="checkbox"
            checked={onlyIcePackGames}
            onChange={(e) => setOnlyIcePackGames((b) => !b)}
            style={{ transform: "translateY(0.12rem)", cursor: "pointer" }}
          />
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Rink</th>
                <th>{onlyIcePackGames ? "Opponent" : "Home"}</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={`${g.Date}-${g.Time}`}>
                  <td>{g.Date.replace(/\)/, ") - ")}</td>
                  <td>{g.Rink}</td>
                  <td>
                    {onlyIcePackGames
                      ? g.Teams.find((t) => t !== "Ice Pack")
                      : g.Teams.join(" vs. ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

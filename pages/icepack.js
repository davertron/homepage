import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { useState } from "react";

import axios from "axios";
import cheerio from "cheerio";

function getText(el, $) {
  const text = $(el).text().replace(/\n/g, "").replace(/\t/g, "");
  return text.replace(/(.*day)/, "$1 ");
}

export async function getServerSideProps() {
  const games = [];
  try {
    const response = await axios
      .get(
        "http://external.horizonwebref.com/scheduleExternal.hwr?asn=206098&enc=a374281e1326d868c25a2314936b52c006dce21a&primary=FFFFFF&secondary=000000&gc=42337",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36",
          },
        }
      )
      .then((r) => r.data);

    const $ = cheerio.load(response);
    const scheduleRows = $("table.dir tr");
    $(scheduleRows).each((index, row) => {
      if (index !== 0) {
        const tds = $(row).find("td");
        const game = {
          Date: getText(tds[0], $),
          Time: getText(tds[1], $),
          Home: getText(tds[3], $),
          Away: getText(tds[4], $),
          Rink: getText(tds[5], $),
        };
        games.push(game);
      }
    });
  } catch (e) {
    console.error(e);
  }
  console.log(games);
  return { props: { games } };
}

export default function IcePack({ games }) {
  const [onlyIcePackGames, setOnlyIcePackGames] = useState(true);

  const icePackGames = games.filter(
    (g) => g.Home === "Ice Pack" || g.Away === "Ice Pack"
  );

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
                <th>Time</th>
                <th>Rink</th>
                <th>{onlyIcePackGames ? "Opponent" : "Home"}</th>
                {!onlyIcePackGames && <th>Away</th>}
              </tr>
            </thead>
            <tbody>
              {games.map((g) => (
                <tr key={`${g.Date}-${g.Time}`}>
                  <td>{g.Date}</td>
                  <td>{g.Time}</td>
                  <td>{g.Rink}</td>
                  <td>
                    {onlyIcePackGames
                      ? g.Away === "Ice Pack"
                        ? g.Home
                        : g.Away
                      : g.Home}
                  </td>
                  {!onlyIcePackGames && <td>{g.Away}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

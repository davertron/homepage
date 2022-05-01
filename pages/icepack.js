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

const DATE_MAP = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

let monthMatcher = new RegExp("(" + Object.keys(DATE_MAP).join("|") + ")");

function getNextGameIndex(games) {
  const today = new Date();

  const gameDates = games.map((g) => {
    // NOTE: This won't account for rollover from year to year since we're
    // appending today's year on to the end of all the dates...might need to use
    // a real date library
    let parseableDate = g.Date.replace(/\(.*\)/g, "").replace(
      / \d\d?:\d\d [ap]m/,
      ""
    );
    let matches = parseableDate.match(monthMatcher);
    if (matches && matches[1]) {
      parseableDate =
        parseableDate.replace(matches[1], DATE_MAP[matches[1]]) +
        " " +
        today.getUTCFullYear();
    }

    console.log(parseableDate);

    return new Date(parseableDate.trim());
  });

  const nextGameIndex = gameDates.indexOf(gameDates.find((d) => d > today));

  return nextGameIndex;
}

// TODO: Show scores
// TODO: Show standings (calculate them?)
// TODO: Don't grey out before index, beacuse this greys out other team's
// games...you should grey out based on whether the game has a score or not (or
// more complicated but grey out on whether its in the past?)
export default function IcePack({ games }) {
  const [onlyIcePackGames, setOnlyIcePackGames] = useState(true);

  const icePackGames = games.filter((g) => g.Teams.includes("Ice Pack"));

  if (onlyIcePackGames) {
    games = icePackGames;
  }

  const nextGameIndex = getNextGameIndex(games);

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
              {games.map((g, i) => {
                const isNextGame = i === nextGameIndex;
                return (
                  <tr
                    key={`${g.Date}-${g.Time}`}
                    style={{
                      backgroundColor: isNextGame ? "#feffbf" : "inherit",
                      position: "relative",
                      color: i < nextGameIndex ? "#bcbcbc" : "inherit",
                    }}
                  >
                    <td>
                      {g.Date.replace(/\)/, ") - ")}
                      {isNextGame && (
                        <div className={styles.nextGameBadge}>Next</div>
                      )}
                    </td>
                    <td>{g.Rink}</td>
                    <td>
                      {onlyIcePackGames
                        ? g.Teams.find((t) => t !== "Ice Pack")
                        : g.Teams.join(" vs. ")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

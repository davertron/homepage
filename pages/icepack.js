import Head from "next/head";
import styles from "../styles/Home.module.css";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { useEffect, useRef, useState } from "react";

import { getGames } from "../lib/getGames";

export async function getServerSideProps({ req, res }) {
  // Set caching headers to cache this for 8 hours...the values on the Full
  // stride site should not be changing very frequently...
  const eightHoursInSeconds = 8 * 60 * 60;
  res.setHeader("Cache-Control", `public, s-maxage=${eightHoursInSeconds}`);
  let games;
  try {
    games = await getGames();
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
  today.setHours(0, 0, 0, 0); // Reset the time to midnight to avoid skipping to the next game prematurely

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

    return new Date(parseableDate.trim());
  });

  const nextGameIndex = gameDates.indexOf(
    gameDates.find((d, i) => d >= today && games[i].Teams.includes("Ice Pack"))
  );

  return nextGameIndex;
}

// TODO: Show scores
// TODO: Put 'icepackOnly' bool into the url
// TODO: Show standings (calculate them?)
// TODO: Don't grey out before index, beacuse this greys out other team's
// games...you should grey out based on whether the game has a score or not (or
// more complicated but grey out on whether its in the past?)
export default function IcePack({ games }) {
  const [onlyIcePackGames, setOnlyIcePackGames] = useState(true);
  const badgeRef = useRef(null);

  useEffect(() => {
    badgeRef.current &&
      badgeRef.current.classList.add(styles.showNextGameBadge);
  }, []);

  if (onlyIcePackGames) {
    games = games.filter((g) => g.Teams.find((t) => /Ice Pack/.test(t)));
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
          <a href="http://www.fullstride.com/senior-d" target="_blank" style={{float: right}}>Fullstride</a>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Rink</th>
                <th>{onlyIcePackGames ? "Opponent" : "Teams"}</th>
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
                      color:
                        /\d/.test(g.Teams) || /cancelled/i.test(g.Date)
                          ? "#bcbcbc"
                          : "inherit",
                    }}
                  >
                    <td>
                      {g.Date.replace(/\)/, ") - ")}
                      {isNextGame && (
                        <div className={styles.nextGameBadge} ref={badgeRef}>
                          Next<div className={styles.arrowStyles}></div>
                        </div>
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
          <iframe
            src="https://calendar.google.com/calendar/embed?src=46pra5covvo98v9uq0pe5ehqb59bm0j9%40import.calendar.google.com&ctz=America%2FNew_York"
            style={{ border: 0, marginTop: 24 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </div>
      </div>
    </>
  );
}

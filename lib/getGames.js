import axios from "axios";
import { load } from "cheerio";

export async function getGames() {
  const games = [];

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

  return games;
}

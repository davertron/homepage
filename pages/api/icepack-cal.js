import ical from "ical-generator";
import { add, parse } from "date-fns";

import { getGames } from "../../lib/getGames";

export default async function (req, res) {
  try {
    const games = await getGames();

    const cal = ical();

    games.forEach((g) => {
      const start = parse(g.Date.trim(), "MMM d (EEE)h:mm a", new Date());
      const end = add(start, { hours: 1 });
      try {
        cal.createEvent({
          start,
          end,
          summary: `Hockey - ${g.Rink}`,
          organizer: "Dave Davis <dabukun@gmail.com>",
        });
      } catch (e) {
        console.error(`Unable to add event: ${e}`);
      }
    });

    res.send(cal.toString());
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
}

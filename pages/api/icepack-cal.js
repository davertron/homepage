import ical from "ical-generator";
import { add, format, parse } from "date-fns";

import { getGames } from "../../lib/getGames";

export default async function (req, res) {
  try {
    let games = await getGames();
    // We only care about ice pack games...
    games = games.filter((g) => /Ice Pack/.test(g.Teams));

    const cal = ical({ name: "Ice Pack Games", timezone: "est" });

    games.forEach((g) => {
      const start = parse(g.Date.trim(), "MMM d (EEE)h:mm a", new Date());
      const end = add(start, { hours: 1 });

      // let formatString = "yyyy-MM-dd hh:mm a x";
      //   console.log(start, end);
      //   console.log(format(start, formatString));
      //   console.log(format(end, formatString));
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

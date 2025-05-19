import Table from "./table";
import Calendar from "./calendar";
import { z } from 'zod';

const GameSchema = z.object({
  eventStartTime: z.number(),
  eventEndTime: z.number(),
  team: z.string(),
  opponent: z.string(),
  rink: z.string(),
  score: z.string()
});

export type Game = z.infer<typeof GameSchema>;

const GamesSchema = z.array(z.any()).transform(arr =>
  arr.filter(item => GameSchema.safeParse(item).success)
);

export default async function Sports() {
  let gamesJSON = await fetch('https://d1msdfi79mlr9u.cloudfront.net/hockey-games/latest.json').then(g => g.json());
  let games = GamesSchema.parse(gamesJSON);
  games = games.sort((a, b) => a.eventStartTime - b.eventStartTime);

  return (
    <div className="max-w-5xl m-auto">
      <h1 className="text-3xl font-bold my-4">Sports Schedule</h1>
      <Calendar games={games} />
      <Table games={games} />
    </div>
  );
}

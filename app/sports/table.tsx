"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import type { Game } from './page';

const dayFormat = 'M/d (ccc)';
const timeFormat = 'h:mm a';

function isPast(game: Game) {
  const gameDate = DateTime.fromMillis(game.eventStartTime);
  const now = DateTime.now();
  return gameDate < now;
}

function TH({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-4 text-left">
      {children}
    </th>
  );
}

function TD({ children }: { children: React.ReactNode }) {
  return (
    <td className="p-4 text-left border-y border-y-gray-300">
      {children}
    </td>
  );
}

export default function Table({ games }: { games: Game[] }) {
  const [showPastGames, setShowPastGames] = useState(false);

  const filteredGames = games.filter((game) => {
    return showPastGames || !isPast(game);
  });

  return (
    <div>
      <div className="flex justify-end">
        <button className="border rounded border-gray-300 py-2 px-4 cursor-pointer my-4" onClick={() => setShowPastGames(!showPastGames)}>{showPastGames ? 'Hide Past Games' : 'Show Past Games'}</button>
      </div>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <TH>Day</TH>
            <TH>Time</TH>
            <TH>Team</TH>
            <TH>Rink</TH>
            <TH>Opponent</TH>
            <TH>Score</TH>
          </tr>
        </thead>
        <tbody>
          {filteredGames.map((game) => (
            <tr key={`${game.team}-${game.eventStartTime}`} className={isPast(game) ? 'bg-gray-50 text-gray-600' : ''}>
              <TD>{DateTime.fromMillis(game.eventStartTime).toFormat(dayFormat)}</TD>
              <TD>{DateTime.fromMillis(game.eventStartTime).toFormat(timeFormat)}</TD>
              <TD>{game.rink}</TD>
              <TD>{game.team}</TD>
              <TD>{game.opponent}</TD>
              <TD>{game.score}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

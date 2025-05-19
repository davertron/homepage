"use client";

import type { Game } from './page';
import { useEffect, useState } from "react";
import { startOfWeek, addDays, isToday, isSameDay, isBefore, startOfDay } from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

function CalendarDayName({ children, isLast }: { children: React.ReactNode, isLast?: boolean }) {
  const rightBorder = isLast ? 'border-r' : '';
  return (
    <div className={`w-1/7 text-center border-l border-t border-b border-collapse border-gray-500 ${rightBorder}`}>
      {children}
    </div>
  );
}

export default function Calendar({ games }: { games: any[] }) {
  // Let's generate a calendar view for this week and the following two weeks
  // Each week starts on Sunday and ends on Saturday
  const today = toZonedTime(new Date(), "America/New_York");;
  const startOfWeekDate = startOfWeek(today, { weekStartsOn: 0 }); // 0 = Sunday

  type Day = {
    date: Date;
    isToday: boolean;
    isPast: boolean;
    games: Game[];
  }

  const nextThreeWeeks: Day[][] = [];
  let currentWeek: Day[] = []

  for (let i = 0; i < 21; i++) { // 3 weeks * 7 days = 21
    const currentDay = addDays(startOfWeekDate, i);
    currentWeek.push({
      date: currentDay,
      isToday: isToday(currentDay),
      isPast: isBefore(startOfDay(currentDay), startOfDay(today)),
      games: games.filter(game => {
        const gameDate = toZonedTime(new Date(game.eventStartTime), "America/New_York");
        return isSameDay(gameDate, currentDay);
      })
        .sort((a, b) => a.eventStartTime - b.eventStartTime)
        .map(game => ({
          ...game,
          time: formatInTimeZone(game.eventStartTime, 'America/New_York', 'h:mm a')
        }))
    });
    if (currentWeek.length === 7) {
      nextThreeWeeks.push(currentWeek);
      currentWeek = [];
    }
  }

  return (
    <div>
      <div className="flex">
        <CalendarDayName>Sun</CalendarDayName>
        <CalendarDayName>Mon</CalendarDayName>
        <CalendarDayName>Tue</CalendarDayName>
        <CalendarDayName>Wed</CalendarDayName>
        <CalendarDayName>Thu</CalendarDayName>
        <CalendarDayName>Fri</CalendarDayName>
        <CalendarDayName isLast>Sat</CalendarDayName>
      </div>

      {nextThreeWeeks.map((week, index) => (
        <div key={index} className="flex">
          {week.map((day, index) => (
            <div className={`flex flex-col w-1/7 p-2 border-l border-b border-gray-500 min-h-40 ${index === week.length - 1 ? 'border-r' : ''}`} key={index}>
              <div className="text-end">{day.date.toLocaleDateString('en-US', { day: 'numeric' })}</div>
              {day.games.map((game, index) => (
                <div className="text-sm" key={index} title={game.rink}>
                  {game.time} - {game.team}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

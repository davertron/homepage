import { load } from "cheerio";

function parseScore(score) {
    if (score === "") {
        return null;
    }
    return parseInt(score, 10);
}

/**
 * @typedef {Object} Game
 * @property {string} Date
 * @property {string} Rink
 * @property {string[]} Teams
 */

/**
 * @param {string} response
 * @returns {Game[]}
 */
export function parseGames(response) {
    const games = [];

    const $ = load(response);

    const $scheduleRows = $(
        "body > font > table > tbody > tr:nth-child(4) > td > table > tbody > tr"
    );

    $scheduleRows.each((index, row) => {
        if (index !== 0) {
            const tds = $(row).find("td");
            const firstTeam = $(tds[3]).find("tr:nth-child(1) td:nth-child(1) font").text();
            const secondTeam = $(tds[3]).find("tr:nth-child(2) td:nth-child(1) font").text();
            const firstScore = $(tds[3]).find("tr:nth-child(1) td:nth-child(2) font").text().trim();
            const secondScore = $(tds[3]).find("tr:nth-child(2) td:nth-child(2) font").text().trim();
            const game = {
                Date: $(tds[0]).text(),
                Rink: $(tds[1]).text(),
                Teams: [firstTeam, secondTeam],
                Scores: [parseScore(firstScore), parseScore(secondScore)],
            };
            games.push(game);
        }
    });

    return games;
}
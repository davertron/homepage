import { parseGames } from "../parseGames";
import mockSchedule from "../__mocks__/mockSchedule";

describe('parseGames', () => {
    let games;
    beforeAll(() => {
        games = parseGames(mockSchedule);
    });

    it('gets the correct game count', () => {
        expect(games.length).toBe(25);
    });

    it('correctly parses the teams', () => {
        expect(games[0].Teams).toEqual(['T Rex', 'Cluster Pucks']);
    });

    it('correctly parses the scores', () => {
        expect(games[0].Scores).toEqual([0, 3]);
    });
});
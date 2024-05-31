import axios from "axios";
import { parseGames } from "./parseGames";

export function fetchGamesPage(url) {
  return axios
    .get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36",
        },
      }
    )
    .then((r) => r.data);
}

export async function getGames() {
  const response = await fetchGamesPage(process.env.FULL_STRIDE_SCHEDULE_URL);

  return parseGames(response);

}

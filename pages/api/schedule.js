import axios from "axios";
import Cors from "cors";

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

const cors = initMiddleware(
  Cors({
    methods: ["GET", "OPTIONS"],
    origin: true, // TODO: Might want to make this work for a set, like just observable but it's fine for now...
  })
);

export default async (req, res) => {
  try {
    await cors(req, res);

    // TODO: This is the old url, you should probably update to the new one...,
    // but I believe this is only used from Observable/Natto now so might not be
    // worth re-writing those...
    return axios
      .get(
        "http://external.horizonwebref.com/scheduleExternal.hwr?asn=206098&enc=a374281e1326d868c25a2314936b52c006dce21a&primary=FFFFFF&secondary=000000&gc=42337",
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.41 Safari/537.36",
          },
        }
      )
      .then((r) => {
        res.status(200).send(r.data);
      })
      .catch((e) => {
        console.error(e);
        res.status(500).send(`Something went wrong: ${e}`);
      });
  } catch (e) {
    console.error(e);
    res.status(500).send(`Something went wrong: ${e}`);
  }
};

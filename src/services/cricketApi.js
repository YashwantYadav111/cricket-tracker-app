alert("CRICKET API FILE LOADED");
import axios from "axios";
import { mockMatches } from "../data/mockData";

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const HOST =
  import.meta.env.VITE_RAPIDAPI_HOST ||
  "cricbuzz-cricket.p.rapidapi.com";

console.log("cricketApi loaded");
console.log("API KEY =", API_KEY);
console.log("HOST =", HOST);

const api = axios.create({
  baseURL: `https://${HOST}`,
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": HOST,
  },
});

const normalize = (data, type = "live") => {
  const blocks = data?.typeMatches || [];
  const matches = [];

  blocks.forEach((block) => {
    const seriesMatches = block?.seriesMatches || [];

    seriesMatches.forEach((seriesBlock) => {
      const wrapper = seriesBlock?.seriesAdWrapper;

      if (!wrapper) return;

      const seriesName = wrapper.seriesName || "Cricket Series";
      const apiMatches = wrapper.matches || [];

      apiMatches.forEach((item) => {
        const info = item?.matchInfo;
        const score = item?.matchScore;

        if (!info?.team1 || !info?.team2) return;

        matches.push({
          id: info.matchId,
          series: seriesName,
          match: info.matchDesc || "Match",
          team1: info.team1.teamName,
          team2: info.team2.teamName,

          score1: score?.team1Score
            ? `${score.team1Score.inngs1?.runs || 0}/${
                score.team1Score.inngs1?.wickets || 0
              } (${score.team1Score.inngs1?.overs || 0})`
            : "Yet to bat",

          score2: score?.team2Score
            ? `${score.team2Score.inngs1?.runs || 0}/${
                score.team2Score.inngs1?.wickets || 0
              } (${score.team2Score.inngs1?.overs || 0})`
            : "Yet to bat",

          status: info.status || type,
          venue: info.venueInfo?.ground || "TBA",

          time: info.startDate
            ? new Date(Number(info.startDate)).toLocaleString()
            : "TBA",

          type,
        });
      });
    });
  });

  console.log("NORMALIZED MATCHES =", matches);

  return matches.length ? matches : mockMatches;
};

export async function getLiveMatches() {
  try {
    console.log("getLiveMatches called");
    console.log("API KEY =", API_KEY);
    console.log("HOST =", HOST);

    if (!API_KEY) {
      alert("API KEY MISSING");
      return mockMatches;
    }

    const response = await api.get("/matches/v1/live");

    console.log("FULL RESPONSE =", response);
    console.log("LIVE API DATA =", response.data);

    alert("API SUCCESS");

    return normalize(response.data, "live");
  } catch (error) {
    console.error("API ERROR =", error);

    alert(
      "API ERROR: " +
      (error.response?.status || error.message)
    );

    return mockMatches;
  }
}

export async function getUpcomingMatches() {
  console.log("getUpcomingMatches called");

  if (!API_KEY) {
    return mockMatches.filter((m) => m.type === "upcoming");
  }

  const response = await api.get("/matches/v1/upcoming");

  console.log("UPCOMING RESPONSE =", response);

  return normalize(response.data, "upcoming");
}

export async function getRecentMatches() {
  console.log("getRecentMatches called");

  if (!API_KEY) {
    return mockMatches;
  }

  const response = await api.get("/matches/v1/recent");

  console.log("RECENT RESPONSE =", response);

  return normalize(response.data, "recent");
}
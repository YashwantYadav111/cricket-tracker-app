import axios from "axios";
import { mockMatches } from "../data/mockData";

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const HOST =
  import.meta.env.VITE_RAPIDAPI_HOST || "cricbuzz-cricket.p.rapidapi.com";

const api = axios.create({
  baseURL: `https://${HOST}`,
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": HOST,
  },
});

const getScoreText = (teamScore) => {
  const inngs = teamScore?.inngs1 || teamScore?.inngs2;
  if (!inngs) return "Yet to bat";
  return `${inngs.runs || 0}/${inngs.wickets || 0} (${inngs.overs || 0})`;
};

const normalize = (data, type = "live") => {
  const blocks = data?.typeMatches || [];
  const matches = [];

  blocks.forEach((block) => {
    const seriesMatches = block?.seriesMatches || [];

    seriesMatches.forEach((seriesBlock) => {
      const wrapper = seriesBlock?.seriesAdWrapper;
      if (!wrapper) return;

      const seriesName = wrapper.seriesName || "Cricket Series";

      (wrapper.matches || []).forEach((item) => {
        const info = item?.matchInfo;
        const score = item?.matchScore;

        if (!info?.team1 || !info?.team2) return;

        matches.push({
          id: info.matchId,
          series: seriesName,
          match: info.matchDesc || "Match",
          team1: info.team1.teamName,
          team2: info.team2.teamName,
          score1: getScoreText(score?.team1Score),
          score2: getScoreText(score?.team2Score),
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

  return matches;
};

export async function getLiveMatches() {
  try {
    if (!API_KEY) return mockMatches;

    const response = await api.get("/matches/v1/live");
    const matches = normalize(response.data, "live");

    return matches.length ? matches : mockMatches;
  } catch (error) {
    console.error("LIVE API ERROR:", error.response?.status || error.message);
    return mockMatches;
  }
}

export async function getUpcomingMatches() {
  try {
    if (!API_KEY) return mockMatches.filter((m) => m.type === "upcoming");

    const response = await api.get("/matches/v1/upcoming");
    const matches = normalize(response.data, "upcoming");

    return matches.length
      ? matches
      : mockMatches.filter((m) => m.type === "upcoming");
  } catch (error) {
    console.error(
      "UPCOMING API ERROR:",
      error.response?.status || error.message
    );

    return mockMatches.filter((m) => m.type === "upcoming");
  }
}

export async function getRecentMatches() {
  try {
    if (!API_KEY) return mockMatches;

    const response = await api.get("/matches/v1/recent");
    const matches = normalize(response.data, "recent");

    return matches.length ? matches : mockMatches;
  } catch (error) {
    console.error("RECENT API ERROR:", error.response?.status || error.message);
    return mockMatches;
  }
}

export async function getIPLMatches() {
  try {
    if (!API_KEY) return mockMatches.filter((m) => m.series.includes("IPL"));

    const [liveRes, upcomingRes, recentRes] = await Promise.allSettled([
      api.get("/matches/v1/live"),
      api.get("/matches/v1/upcoming"),
      api.get("/matches/v1/recent"),
    ]);

    const allMatches = [];

    if (liveRes.status === "fulfilled") {
      allMatches.push(...normalize(liveRes.value.data, "live"));
    }

    if (upcomingRes.status === "fulfilled") {
      allMatches.push(...normalize(upcomingRes.value.data, "upcoming"));
    }

    if (recentRes.status === "fulfilled") {
      allMatches.push(...normalize(recentRes.value.data, "recent"));
    }

    const iplMatches = allMatches.filter((m) => {
      const text = `${m.series} ${m.match} ${m.team1} ${m.team2}`.toLowerCase();

      return (
        text.includes("ipl") ||
        text.includes("indian premier league") ||
        text.includes("rcb") ||
        text.includes("csk") ||
        text.includes("mi") ||
        text.includes("kkr") ||
        text.includes("srh") ||
        text.includes("rr") ||
        text.includes("dc") ||
        text.includes("gt") ||
        text.includes("pbks") ||
        text.includes("lsg")
      );
    });

    return iplMatches.length
      ? iplMatches
      : mockMatches.filter((m) => m.series.includes("IPL"));
  } catch (error) {
    console.error("IPL API ERROR:", error.response?.status || error.message);
    return mockMatches.filter((m) => m.series.includes("IPL"));
  }
}
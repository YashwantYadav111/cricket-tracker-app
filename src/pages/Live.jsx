import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import { getLiveMatches, getUpcomingMatches } from "../services/cricketApi";

export default function Live() {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [iplMatches, setIplMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const isIPL = (m) => {
    const text = `${m.series} ${m.match} ${m.team1} ${m.team2}`.toLowerCase();

    return (
      text.includes("ipl") ||
      text.includes("indian premier league") ||
      text.includes("csk") ||
      text.includes("mi") ||
      text.includes("rcb") ||
      text.includes("kkr") ||
      text.includes("srh") ||
      text.includes("rr") ||
      text.includes("dc") ||
      text.includes("gt") ||
      text.includes("pbks") ||
      text.includes("lsg")
    );
  };

  useEffect(() => {
    async function loadData() {
      try {
        const live = await getLiveMatches();
        const upcoming = await getUpcomingMatches();

        setLiveMatches(live);
        setUpcomingMatches(upcoming);
        setIplMatches([...live, ...upcoming].filter(isIPL));
      } catch (error) {
        console.error("MATCH DATA ERROR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const timer = setInterval(loadData, 30000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <div className="loader">Loading matches...</div>;
  }

  return (
    <>
      <h1>Live Cricket Score</h1>
      <p className="sub">Live, upcoming and IPL matches in one place.</p>

      <h2 className="sectionTitle">🏏 Live Matches</h2>
      <div className="grid">
        {liveMatches.length > 0 ? (
          liveMatches.map((m) => <MatchCard key={m.id} m={m} />)
        ) : (
          <div className="loader">No live matches right now.</div>
        )}
      </div>

      <h2 className="sectionTitle">📅 Upcoming Matches</h2>
      <div className="grid">
        {upcomingMatches.length > 0 ? (
          upcomingMatches.map((m) => <MatchCard key={m.id} m={m} />)
        ) : (
          <div className="loader">No upcoming matches found.</div>
        )}
      </div>

      <h2 className="sectionTitle">🔥 IPL Matches</h2>
      <div className="grid">
        {iplMatches.length > 0 ? (
          iplMatches.map((m) => <MatchCard key={`ipl-${m.id}`} m={m} />)
        ) : (
          <div className="loader">
            IPL matches not available in current API response.
          </div>
        )}
      </div>
    </>
  );
}
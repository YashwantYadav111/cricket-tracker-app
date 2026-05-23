import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import { getUpcomingMatches } from "../services/cricketApi";

export default function Upcoming() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getUpcomingMatches().then(setMatches);
  }, []);

  return (
    <>
      <h1>📅 Upcoming Matches</h1>
      <p className="sub">Upcoming international and league matches from API.</p>
      <div className="grid">
        {matches.map(m => <MatchCard key={m.id} m={m} />)}
      </div>
    </>
  );
}
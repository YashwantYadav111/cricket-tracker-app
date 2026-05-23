import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import { getUpcomingMatches } from "../services/cricketApi";

export default function Schedule() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUpcomingMatches()
      .then((data) => {
        console.log("UPCOMING MATCHES ON PAGE:", data);
        setMatches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("SCHEDULE ERROR:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>Match Schedule</h1>
      <p className="sub">Upcoming international and league matches.</p>

      {loading ? (
        <div className="loader">Loading upcoming matches...</div>
      ) : matches.length === 0 ? (
        <div className="loader">No upcoming matches found.</div>
      ) : (
        <div className="grid">
          {matches.map((m) => (
            <MatchCard key={m.id} m={m} />
          ))}
        </div>
      )}
    </>
  );
}
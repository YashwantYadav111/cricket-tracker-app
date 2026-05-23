import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MatchCard from "../components/MatchCard";
import { getLiveMatches } from "../services/cricketApi";

export default function Home() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    console.log("HOME PAGE LOADED");

    async function loadMatches() {
      console.log("CALLING API...");

      const data = await getLiveMatches();

      console.log("MATCHES RECEIVED:", data);

      setMatches(data);
    }

    loadMatches();
  }, []);

  return (
    <>
      <section className="hero">
        <div>
          <span className="tag">MINI CRICBUZZ / ESPN STYLE</span>

          <h1>
            Live Cricket Scores, Match Details & Player Stats
          </h1>

          <p>
            Pure React cricket tracker with RapidAPI support,
            beautiful UI, live cards and admin-style news manager.
          </p>

          <Link className="btn" to="/live">
            View Live Matches
          </Link>
        </div>

        <div className="heroBox">
          <h2>Today’s Highlight</h2>

          {matches[0] && <MatchCard m={matches[0]} />}
        </div>
      </section>

      <h2 className="sectionTitle">Live Matches</h2>

      <div className="grid">
        {matches.map((m) => (
          <MatchCard key={m.id} m={m} />
        ))}
      </div>
    </>
  );
}
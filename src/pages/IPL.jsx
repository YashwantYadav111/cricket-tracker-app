import { useEffect, useState } from "react";
import MatchCard from "../components/MatchCard";
import { getLiveMatches, getUpcomingMatches } from "../services/cricketApi";

const fallbackIPL = [
  { id:"ipl1", series:"IPL 2026", match:"RCB vs CSK", team1:"RCB", team2:"CSK", score1:"-", score2:"-", status:"Upcoming", venue:"Chinnaswamy Stadium", time:"7:30 PM", type:"upcoming" },
  { id:"ipl2", series:"IPL 2026", match:"MI vs KKR", team1:"MI", team2:"KKR", score1:"-", score2:"-", status:"Upcoming", venue:"Wankhede Stadium", time:"7:30 PM", type:"upcoming" },
  { id:"ipl3", series:"IPL 2026", match:"SRH vs LSG", team1:"SRH", team2:"LSG", score1:"-", score2:"-", status:"Upcoming", venue:"Hyderabad", time:"7:30 PM", type:"upcoming" }
];

export default function IPL() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const isIPL = (m) => {
    const text = `${m.series} ${m.match} ${m.team1} ${m.team2}`.toLowerCase();
    return text.includes("ipl") || text.includes("indian premier league");
  };

  useEffect(() => {
    async function load() {
      const live = await getLiveMatches();
      const upcoming = await getUpcomingMatches();
      const apiIPL = [...live, ...upcoming].filter(isIPL);
      setMatches(apiIPL.length ? apiIPL : fallbackIPL);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <>
      <h1>🔥 IPL Matches</h1>
      <p className="sub">IPL live and upcoming matches.</p>
      {loading ? <div className="loader">Loading IPL...</div> :
        <div className="grid">{matches.map(m => <MatchCard key={m.id} m={m} />)}</div>
      }
    </>
  );
}
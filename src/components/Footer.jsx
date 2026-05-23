import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <h2 className="footer-logo">
          🏏 Cricket Tracker Web Application
        </h2>

        <p className="footer-tagline">
          Live Scores • IPL • Upcoming Matches • Match Center • Scorecards •
          Player Stats • Schedule • Cricket News
        </p>
      </div>

      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/live">Live Matches</Link>
        <Link to="/upcoming">Upcoming</Link>
        <Link to="/ipl">IPL</Link>
        <Link to="/schedule">Schedule</Link>
        <Link to="/players">Players</Link>
        <Link to="/teams">Teams</Link>
        <Link to="/news">News</Link>
        <Link to="/admin">Admin</Link>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© 2026 Cricket Tracker web application. All Rights Reserved.</p>

        <p>
          Designed & Developed by
          <span className="owner"> Yashwant Yadav</span>
        </p>
      </div>
    </footer>
  );
}
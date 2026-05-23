import { NavLink } from "react-router-dom";
import { Radio } from "lucide-react";

export default function Navbar() {
  const links = [
    ["/", "Home"],
    ["/live", "Live"],
    ["/upcoming", "Upcoming"],
    ["/ipl", "IPL"],
    ["/schedule", "Schedule"],
    ["/players", "Players"],
    ["/teams", "Teams"],
    ["/news", "News"],
    ["/admin", "Admin"],
  ];

  return (
    <header className="nav">
      <div className="brand">
        <Radio />
        Cricket Tracker Web Application
      </div>

      <nav>
        {links.map(([to, t]) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            {t}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
import { useEffect, useState } from "react";
import { getPublicStats } from "../../services/stats.service";

export default function PublicStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getPublicStats().then(setStats);
  }, []);

  if (!stats) return null;

  return (
    <section className="stats-section">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.residents}</h3>
          <p>Total Residents</p>
        </div>

        <div className="stat-card">
          <h3>{stats.listings}</h3>
          <p>Available Listings</p>
        </div>

        <div className="stat-card">
          <h3>{stats.reports}</h3>
          <p>Community Reports</p>
        </div>
      </div>
    </section>
  );
}

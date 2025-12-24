import { useEffect, useState } from "react";
import { listenToDashboardStats } from "../../services/dashboard.service";
import { listenToUpcomingEvents } from "../../services/dashboard.service";


export default function Dashboard() {
  const [stats, setStats] = useState({
    residents: 0,
    listings: 0,
    amenities: 0,
    reports: 0,
    expenses: 0,
    income: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);


  useEffect(() => {
  const unsubStats = listenToDashboardStats(setStats);
  const unsubEvents = listenToUpcomingEvents(setUpcomingEvents);

  return () => {
    unsubStats();
    unsubEvents();
  };
}, []);


  const happyResidents = stats.residents * 5;
  const housesCount = stats.residents;

  return (
    <section className="admin-page">
      <h2 className="dashboard-title">Welcome, Admin!</h2>

      <div className="dashboard-grid modern">

        {/* HAPPY RESIDENTS */}
        <DashboardCard
          title="Happy Residents"
          value={`${happyResidents}+`}
          subtitle="Community satisfaction"
          icon="😊"
        />

        {/* NO OF HOUSES */}
        <DashboardCard
          title="No. of Houses"
          value={`${housesCount}+`}
          subtitle="Occupied homes"
          icon="🏠"
        />

        {/* AMENITIES (FIXED) */}
        <DashboardCard
          title="Amenities"
          value="30+"
          subtitle="Community facilities"
          icon="🏊"
        />

        {/* PENDING REPORTS (LIVE) */}
        <DashboardCard
          title="Pending Reports"
          value={stats.reports}
          subtitle="Awaiting review"
          icon="📄"
        />

        {/* TOTAL EXPENSES (UNCHANGED) */}
        <DashboardCard
          title="Total Expenses"
          value={`₹ ${stats.expenses}`}
          subtitle="Records logged"
          icon="💰"
        />

        {/* TOTAL INCOME (NEW) */}
<DashboardCard
  title="Total Income"
  value={`₹ ${stats.income}`}
  subtitle="Maintenance collected"
  icon="💵"
/>
      </div>
    </section>
  );
}

function DashboardCard({ title, value, subtitle, icon }) {
  return (
    <div className="dashboard-card modern">
      <div className="card-icon">{icon}</div>
      <div>
        <p className="card-title">{title}</p>
        <h3 className="card-value">{value}</h3>
        <p className="card-sub">{subtitle}</p>
      </div>
    </div>
  );
}

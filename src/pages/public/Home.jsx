import { useEffect, useState } from "react";
import { listenToUpcomingEvents } from "../../services/dashboard.service";
import { getStaff } from "../../services/staff.service";

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const unsub = listenToUpcomingEvents(setUpcomingEvents);
    return () => unsub();
  }, []);

  useEffect(() => {
    getStaff().then(setStaff);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero hero-bg">
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Welcome to Our Community</h1>
          <p>
            A modern, secure, and professional residence management platform
            designed for seamless community operations.
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section">
        <h2>About the Community</h2>
        <p>
          Our community is built around comfort, security, and a strong sense of
          belonging. Designed to support modern living, it offers well-planned
          residences, thoughtfully curated amenities, and a safe environment
          for families and individuals alike.
        </p>
      </section>

      {/* HIGHLIGHTS */}
      <section className="section">
        <h2 className="section-title">Community Highlights</h2>

        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon">🏋️</div>
            <h4>Fitness Center</h4>
            <p>State-of-the-art gym equipment</p>
          </div>

          <div className="highlight-card">
            <div className="highlight-icon">🌳</div>
            <h4>Green Spaces</h4>
            <p>Beautiful parks and landscaped gardens</p>
          </div>

          <div className="highlight-card">
            <div className="highlight-icon">🔒</div>
            <h4>24/7 Security</h4>
            <p>Professional security personnel</p>
          </div>
        </div>
      </section>

      {/* STAFF */}
      <section className="section staff-section">
        <h2>Our Staff</h2>

        <div className="staff-grid">
          {staff.map((s) => (
            <div key={s.id} className="staff-card">
              <div className="staff-avatar">👤</div>
              <h4>{s.name}</h4>
              <p className="staff-role">{s.role}</p>
              <p className="staff-contact">📞 {s.phone}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="section upcoming-events">
        <h2>Upcoming Events</h2>

        <ul className="events-list">
          {upcomingEvents.map((event) => (
            <li key={event.id} className="event-item">
              <div className="event-date">
                <div className="day">
                  {new Date(event.date).getDate()}
                </div>
                <div className="month">
                  {new Date(event.date).toLocaleString("en-US", {
                    month: "short",
                  })}
                </div>
              </div>

              <div className="event-info">
                <h4>{event.title}</h4>
                <p>
                  {event.date} • {event.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

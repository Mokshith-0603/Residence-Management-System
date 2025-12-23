import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../services/auth.service";
import { getAnnouncements } from "../../services/announcement.service";

export default function Header() {
  const user = useAuth(); // ✅ FIXED

  const [hasNewAnnouncement, setHasNewAnnouncement] = useState(false);

  useEffect(() => {
    async function checkAnnouncements() {
      const announcements = await getAnnouncements();
      const lastViewed = localStorage.getItem("announcementsViewedAt");

      if (!lastViewed && announcements.length > 0) {
        setHasNewAnnouncement(true);
        return;
      }

      const latest = announcements[0]?.createdAt?.toDate?.();
      if (latest && new Date(latest) > new Date(lastViewed)) {
        setHasNewAnnouncement(true);
      }
    }

    checkAnnouncements();
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">Sathya Sai Royal Gardens</h1>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/residents">Residents</Link>
          <Link to="/listings">Listings</Link>
          {/* Announcements */}
          <div className="nav-item announcement-nav">
            <Link to="/announcements" className="nav-link">
              Announcements
              {hasNewAnnouncement && <span className="notify-dot" />}
            </Link>
          </div>
          <Link to="/wishlist">Wishlist</Link>

          <Link to="/rules">Rules</Link>
          <Link to="/reports">Report</Link>


          
        </nav>

        {user ? (
          <Link to="/admin" className="admin-btn">
            Dashboard
          </Link>
        ) : (
          <Link to="/admin/login" className="admin-btn">
            Admin Login
          </Link>
        )}
      </div>
    </header>
  );
}

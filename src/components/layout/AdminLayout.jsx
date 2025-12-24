import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { adminLogout } from "../../services/auth.service";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      {/* ================= SIDEBAR ================= */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">Estate Manager</div>

        <nav className="sidebar-nav">
          <NavLink to="/admin" end>
            Dashboard
          </NavLink>

          <NavLink to="/admin/residents">
            Residents
          </NavLink>

          <NavLink to="/admin/announcements">
            Announcement
          </NavLink>
          <NavLink to="/admin/staff">
          Staff
          </NavLink>

          <NavLink to="/admin/events">
            <span>Events</span>
          </NavLink>
          
          <NavLink to="/admin/listings">
            Listings
          </NavLink>

          <NavLink to="/admin/wishlist">
            Wishlist
          </NavLink>

          <NavLink to="/admin/expenses">
            Maintenance Bill
          </NavLink>

          <NavLink to="/admin/reports">
            Reports
          </NavLink>

          <NavLink to="/admin/rules">
            Rules
          </NavLink>
        </nav>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="admin-main">
        {/* TOP BAR */}
        <header className="admin-topbar">
          <div className="community-name">
            Sathya Sai Royal Gardens
          </div>

          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

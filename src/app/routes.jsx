import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";

/* ---------- Public Pages ---------- */
import Home from "../pages/public/Home";
import Listings from "../pages/public/Listings";
import Reports from "../pages/public/Reports";
import Rules from "../pages/public/Rules";
import PublicResidents from "../pages/public/Residents";
import PublicAnnouncements from "../pages/public/Announcements";
import PublicWishlist from "../pages/public/Wishlist";

/* ---------- Admin Pages ---------- */
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import AdminResidents from "../pages/admin/Residents";
import AdminAnnouncements from "../pages/admin/Announcements";
import Expenses from "../pages/admin/Expenses";
import AdminReports from "../pages/admin/Reports";
import AdminListings from "../pages/admin/Listings";
import AdminRules from "../pages/admin/Rules";
import AdminWishlist from "../pages/admin/Wishlist";
import Events from "../pages/admin/Events";


export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC SITE ================= */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/residents" element={<PublicResidents />} />
        <Route path="/announcements" element={<PublicAnnouncements />} />
        <Route path="/wishlist" element={<PublicWishlist />} />
        
      </Route>

      {/* ================= ADMIN AUTH ================= */}
      <Route path="/admin/login" element={<Login />} />

      {/* ================= ADMIN DASHBOARD ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="residents" element={<AdminResidents />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="listings" element={<AdminListings />} />
        <Route path="rules" element={<AdminRules />} />
        <Route path="wishlist" element={<AdminWishlist />} />
        <Route path="/admin/events" element={<Events />} />
      </Route>

    </Routes>
  );
}

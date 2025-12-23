import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

/* =========================================================
   DASHBOARD STATS
   ========================================================= */

export async function getDashboardStats() {
  const residentsSnap = await getDocs(collection(db, "residents"));
  const reportsSnap = await getDocs(collection(db, "reports"));

  const residentsCount = residentsSnap.size;

  // Pending reports = status === "open"
  const pendingReports = reportsSnap.docs.filter(
    d => d.data().status === "open"
  ).length;

  return {
    residentsCount,
    happyResidents: residentsCount * 5,
    housesCount: residentsCount,
    pendingReports
  };
}

/* =========================================================
   RESIDENTS MODULE
   ========================================================= */

const residentsRef = collection(db, "residents");

export async function getResidents() {
  const snapshot = await getDocs(residentsRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addResident(data) {
  return addDoc(residentsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function updateResident(id, data) {
  return updateDoc(doc(db, "residents", id), data);
}

export async function deleteResident(id) {
  return deleteDoc(doc(db, "residents", id));
}

/* =========================================================
   ANNOUNCEMENTS MODULE
   ========================================================= */

const announcementsRef = collection(db, "announcements");

export async function getAnnouncements() {
  const snapshot = await getDocs(announcementsRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addAnnouncement(data) {
  return addDoc(announcementsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function deleteAnnouncement(id) {
  return deleteDoc(doc(db, "announcements", id));
}

/* =========================================================
   LISTINGS MODULE
   ========================================================= */

const listingsRef = collection(db, "listings");

export async function getListings() {
  const snapshot = await getDocs(listingsRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addListing(data) {
  return addDoc(listingsRef, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function deleteListing(id) {
  return deleteDoc(doc(db, "listings", id));
}

/* =========================================================
   MAINTENANCE BILLS MODULE (IMPORTANT)
   ========================================================= */

const maintenanceRef = collection(db, "maintenanceBills");

/**
 * Save a complete maintenance bill
 * One bill = one month / one title
 */
export async function saveMaintenanceBill({ title, entries }) {
  const ref = await addDoc(maintenanceRef, {
    title,
    entries,
    createdAt: serverTimestamp()
  });
  return ref.id;
}

/**
 * Get all saved maintenance bills
 * Used on reload to restore data
 */
export async function getMaintenanceBills() {
  const snapshot = await getDocs(maintenanceRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

/**
 * Update entries of an existing bill
 */
export async function updateMaintenanceBill(billId, entries) {
  return updateDoc(doc(db, "maintenanceBills", billId), {
    entries,
    updatedAt: serverTimestamp()
  });
}

/**
 * Delete an entire bill (optional)
 */
export async function deleteMaintenanceBill(billId) {
  return deleteDoc(doc(db, "maintenanceBills", billId));
}

/* =========================================================
   REPORTS MODULE
   ========================================================= */

const reportsRef = collection(db, "reports");

export async function getReports() {
  const snapshot = await getDocs(reportsRef);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addReport(data) {
  return addDoc(reportsRef, {
    ...data,
    status: "open",
    createdAt: serverTimestamp()
  });
}

export async function updateReportStatus(id, status) {
  return updateDoc(doc(db, "reports", id), { status });
}

export async function deleteReport(id) {
  return deleteDoc(doc(db, "reports", id));
}
/* ================= RULES MODULE ================= */

const rulesRef = collection(db, "rules");

export async function getRules() {
  const snap = await getDocs(rulesRef);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addRule(text) {
  return addDoc(rulesRef, {
    text,
    createdAt: serverTimestamp()
  });
}

export async function updateRule(id, text) {
  return updateDoc(doc(db, "rules", id), { text });
}

export async function deleteRule(id) {
  return deleteDoc(doc(db, "rules", id));
}
/* ================= WISHLIST ================= */

const wishlistRef = collection(db, "wishlist");

export async function getWishlist() {
  const snap = await getDocs(wishlistRef);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addWishlistItem(data) {
  return addDoc(wishlistRef, {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function deleteWishlistItem(id) {
  return deleteDoc(doc(db, "wishlist", id));
}

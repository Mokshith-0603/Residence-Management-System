import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getPublicStats() {
  const residentsSnap = await getDocs(collection(db, "residents"));
  const listingsSnap = await getDocs(collection(db, "listings"));
  const reportsSnap = await getDocs(collection(db, "reports"));

  return {
    residents: residentsSnap.size,
    listings: listingsSnap.size,
    reports: reportsSnap.size
  };
}

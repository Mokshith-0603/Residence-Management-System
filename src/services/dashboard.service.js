import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function listenToDashboardStats(callback) {
  const unsubResidents = onSnapshot(
    collection(db, "residents"),
    (snapshot) => {
      callback((prev) => ({
        ...prev,
        residents: snapshot.size
      }));
    }
  );

  const unsubListings = onSnapshot(
    collection(db, "listings"),
    (snapshot) => {
      callback((prev) => ({
        ...prev,
        listings: snapshot.size
      }));
    }
  );

  return () => {
    unsubResidents();
    unsubListings();
  };
}

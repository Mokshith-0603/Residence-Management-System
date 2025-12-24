import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit
} from "firebase/firestore";
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

  const unsubExpenses = onSnapshot(
  collection(db, "expenses"),
  (snapshot) => {
    let totalExpenses = 0;

    snapshot.forEach((doc) => {
      totalExpenses += Number(doc.data().amount || 0);
    });

    callback((prev) => ({
      ...prev,
      expenses: totalExpenses
    }));
  }
);
const unsubIncome = onSnapshot(
  collection(db, "maintenanceBills"),
  (snapshot) => {
    let totalIncome = 0;

    snapshot.forEach((doc) => {
      const bill = doc.data();
      bill.entries?.forEach((entry) => {
        totalIncome += Number(entry.amount || 0);
      });
    });

    callback((prev) => ({
      ...prev,
      income: totalIncome
    }));
  }
);

  return () => {
    unsubResidents();
    unsubListings();
    unsubExpenses();
    unsubIncome();
  };
}
export function listenToUpcomingEvents(callback) {
  const today = new Date().toISOString().split("T")[0];

  const q = query(
    collection(db, "events"),
    where("date", ">=", today),
    orderBy("date"),
    limit(5)
  );

  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(events);
  });
}

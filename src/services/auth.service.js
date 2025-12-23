import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useEffect, useState } from "react";

export const adminLogin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const adminLogout = () => signOut(auth);

export function useAuth() {
  const [user, setUser] = useState(undefined); // 👈 important

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return unsubscribe;
  }, []);

  return user;
}

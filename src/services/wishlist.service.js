import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";

const wishlistRef = collection(db, "wishlist");

export async function getWishlistItems() {
  const snap = await getDocs(wishlistRef);
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data()
  }));
}

export async function addWishlistItem(item) {
  return addDoc(wishlistRef, {
    ...item,
    createdAt: serverTimestamp()
  });
}

export async function deleteWishlistItem(id) {
  return deleteDoc(doc(db, "wishlist", id));
}

export async function updateWishlistItem(id, data) {
  return updateDoc(doc(db, "wishlist", id), data);
}

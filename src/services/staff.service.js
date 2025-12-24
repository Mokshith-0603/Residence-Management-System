import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

const ref = collection(db, "staff");

export const getStaff = async () => {
  const snap = await getDocs(ref);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const addStaff = async (data) => {
  await addDoc(ref, { ...data, createdAt: Timestamp.now() });
};

export const updateStaff = async (id, data) => {
  await updateDoc(doc(db, "staff", id), data);
};

export const deleteStaff = async (id) => {
  await deleteDoc(doc(db, "staff", id));
};

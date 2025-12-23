import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(file) {
  const imageRef = ref(
    storage,
    `listings/${Date.now()}-${file.name}`
  );
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

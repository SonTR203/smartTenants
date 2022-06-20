import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

export const deleteItemFromFirestore = async (collection, id) => {
  try {
    const singleDoc = doc(db, collection, id);
    await deleteDoc(singleDoc);
    return true;
  } catch (error) {
    console.log("error deleting item in Firestore", error);
    return false;
  }
};

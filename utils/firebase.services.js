import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

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

export const createItemInFirestore = async (collection, id, propertyObject) => {
  try {
    await setDoc(doc(db, collection, id), propertyObject)
      .then(() => {
        console.log(collection, ": new Document successfully written!");
      })
      .catch((error) => {
        throw new Error(error);
      });

    return true;
  } catch (err) {
    console.log(collection, "ERROR Posting to DB: ", err);
    alert("Failed to post new item. Please try again later");
    return false;
  }
};

export const deleteImageFromStorage = async (imageName) => {
  try {
    const imageRef = ref(getStorage(), imageName);
    await deleteObject(imageRef)
      .then(() => {
        // File deleted successfully
        console.log("image from failed post deleted!");
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
        throw new Error(error);
      });

    return true;
  } catch (error) {
    console.log("ERROR deleting failed post Storage image: ", error);
    return false;
  }
};

export const uploadImageToStorage = async (newImage, postId, userId) => {
  try {
    const imageName = `Images/Posts/Marketplace/${userId}-${postId}.jpg`;
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", newImage, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), imageName);
    await uploadBytes(fileRef, blob);

    const imgUrl = await getDownloadURL(fileRef);
    return imgUrl;
  } catch (err) {
    console.log("ERROR uploading image to Storage: ", err);
    alert("Failed to upload image. Please try again later");
    return false;
  }
};

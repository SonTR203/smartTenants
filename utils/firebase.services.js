import {
  deleteDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

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

export const updateItemInFirestore = async (collection, id, propertyObject) => {
  try {
    await updateDoc(doc(db, collection, id), propertyObject)
      .then(() => {
        console.log("Document updated successfully!");
        // console.log(collection, ":  Document updated successfully!");
      })
      .catch((error) => {
        throw new Error(error);
      });

    return true;
  } catch (error) {
    console.log("error updating item in Firestore", error);
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

export const getItemById = async (collection, id) => {
  try {
    const docRef = doc(db, collection, id);
    const docSnap = await getDoc(docRef);

    return docSnap.data();
  } catch (error) {
    console.log("error getting item from Firestore", error);
    return false;
  }
};

export const uploadImageToStorage = async (imagePath, newImage) => {
  try {
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

    const fileRef = ref(getStorage(), imagePath);
    await uploadBytes(fileRef, blob);

    const imgUrl = await getDownloadURL(fileRef);
    return imgUrl;
  } catch (err) {
    console.log("ERROR uploading image to Storage: ", err);
    alert("Failed to upload image. Please try again later");
    return false;
  }
};

export const getMarketplaceItems = async () => {
  const colRef = collection(db, "Marketplace");

  const data = await getDocs(colRef);
  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
    };
  });

  return formattedData;
};

export const uploadExpoPushToken = async (user) => {
  const expoPushToken = await registerForPushNotificationsAsync();
  try {
    await setDoc(doc(db, "ExpoPushTokens", user.uid), {
      id: user.uid,
      expoPushToken: expoPushToken ? expoPushToken : "",
    });
  } catch (error) {
    console.log(error);
  }
};

export const removeExpoPushToken = async (uid) => {
  try {
    await updateDoc(doc(db, "ExpoPushTokens", uid), {
      expoPushToken: "",
    });
  } catch (error) {
    console.log(error);
  }
};

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  // if (Platform.OS === "android") {
  //   Notifications.setNotificationChannelAsync("default", {
  //     name: "default",
  //     importance: Notifications.AndroidImportance.MAX,
  //     vibrationPattern: [0, 250, 250, 250],
  //     lightColor: "#FF231F7C",
  //   });
  // }

  return token;
}

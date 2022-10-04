import {
  deleteDoc,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  getDoc,
  onSnapshot,
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
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { Alert, Linking } from "react-native";

const auth = getAuth();

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

export const createListener = (col, callback) => {
  const colRef = collection(db, col);
  return onSnapshot(colRef, { includeMetadataChanges: true }, callback());
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

export const deleteMultipleImages = async (images) => {
  for await (const image of images) {
    console.log("deleting image", image);
    await deleteImageFromStorage(image);
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
    console.log("uploading image to storage: ", imagePath, newImage);
    const img = await fetch(newImage);
    const blob = await img.blob();

    const fileRef = ref(getStorage(), imagePath);
    await uploadBytes(fileRef, blob);
    console.log("uploaded a blob to storage");

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

  const sortedColRef = query(colRef, where("isNSFW", "==", false));

  const data = await getDocs(sortedColRef);
  const formattedData = data.docs.map((doc) => {
    return {
      ...doc.data(),
    };
  });

  return formattedData;
};

export const uploadExpoPushToken = async (id, buildingName = null) => {
  const expoPushToken = await registerForPushNotificationsAsync();
  try {
    await setDoc(doc(db, "ExpoPushTokens", id), {
      id: id,
      expoPushToken: expoPushToken ? expoPushToken : "",
      buildingName: buildingName ? buildingName : "",
    });
  } catch (error) {
    console.log("error uploading expo token: ", error);
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
      Alert.alert(
        "Permission Denied",
        "You need to allow Notification permissions",
        [
          {
            text: "Settings",
            style: "cancel",
            onPress: () => {
              Linking.openSettings();
            },
          },
          { text: "OK" },
        ]
      );
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
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

export const handleSignIn = async (email, password) => {
  try {
    const uid = signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredentials) => {
        console.log("Signed in with email:", userCredentials.user.email);
        return userCredentials.user.uid;
      })
      .catch((err) => {
        let errorMessage = "Something went wrong. Please try again.";
        switch (err.code) {
          case "auth/user-not-found":
            errorMessage = "User not found. Please try again.";
            break;
          case "auth/wrong-password":
            errorMessage = "Wrong password. Please try again.";
            break;
          case "auth/invalid-email":
            errorMessage = "Invalid email. Please try again.";
            break;
          case "auth/email-already-in-use":
            errorMessage = "Email already in use. Please try again.";
            break;
          default:
            break;
        }
        return {
          error: true,
          errorMessage,
        };
      });
    return uid;
  } catch (error) {
    console.log("error sign in with email and password: ", error);
  }
};

export const handleFirebaseAuthenticationError = (error) => {
  console.log("error  authenticating with Firebase", error.code);
  let errorMessage = "";
  switch (error.code) {
    case "auth/invalid-email":
      errorMessage = "Invalid email address.";
      break;
    case "auth/wrong-password":
      errorMessage = "Wrong password.";
      break;
    case "auth/weak-password":
      errorMessage = "Password is too weak.";
      break;
    case "auth/too-many-requests":
      errorMessage = "Too many requests. Please try again later.";
      break;
    case "auth/user-not-found":
      errorMessage = "User not found. Please sign up first.";
      break;
    default:
      errorMessage = "Unknown error.";
      break;
  }

  return errorMessage;
};

export const updateUserPassword = async (newPassword) => {
  const user = auth.currentUser;
  try {
    await updatePassword(user, newPassword);
    return "success";
  } catch (error) {
    return error.message;
  }
};

export const updateUserEmail = async (newEmail) => {
  const user = auth.currentUser;
  try {
    await updateEmail(user, newEmail);
    return "success";
  } catch (error) {
    return error.message;
  }
};
export const verifyPassword = async (password, cb, setErrorText) => {
  const creds = EmailAuthProvider.credential(auth.currentUser.email, password);
  try {
    await reauthenticateWithCredential(auth.currentUser, creds).then(() => {
      if (cb) cb();
    });
  } catch (error) {
    console.log(error);
    if (error.message.includes("wrong-password"))
      return setErrorText("Incorrect password");
    return setErrorText("Something went wrong, please try again");
  }
};

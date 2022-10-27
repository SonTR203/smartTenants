import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// To move to development env please uncomment below line by default it will be on DEV
import firebaseConfig from "./config/env.js";

// To move to production env please uncomment below line (ONLY WITH APPROVAL OF ADESH SHAH)
// import firebaseConfig from "./config/env.production";

// https://firebase.google.com/docs/web/setup#available-libraries
// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Export reference to firebase app
export { app };
//Export Access to DB
export const db = getFirestore(app);

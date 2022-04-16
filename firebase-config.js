import { initializeApp } from 'firebase/app';
import { getFirestore } from '@firebase/firestore';
import firebaseConfig from './config/env';

// https://firebase.google.com/docs/web/setup#available-libraries
// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Export Access to DB
export const db = getFirestore(app);

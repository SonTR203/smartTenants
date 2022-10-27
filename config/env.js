// This firebase config will use the development database
const firebaseConfig = {
  apiKey: process.env.API_KEY_DEV,
  authDomain: process.env.AUTH_DOMAIN_DEV,
  projectId: process.env.PROJECT_ID_DEV,
  storageBucket: process.env.STORAGE_BUCKET_DEV,
  messagingSenderId: process.env.MESSAGING_SENDER_ID_DEV,
  appId: process.env.APP_ID_DEV,
  measurementId: process.env.MEASUREMENT_ID_DEV,
};

// This firebase config will use the production database
// const firebaseConfig = {
//   apiKey: process.env.API_KEY_PROD,
//   authDomain: process.env.AUTH_DOMAIN_PROD,
//   projectId: process.env.PROJECT_ID_PROD,
//   storageBucket: process.env.STORAGE_BUCKET_PROD,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID_PROD,
//   appId: process.env.APP_ID_PROD,
//   measurementId: process.env.MEASUREMENT_ID_PROD,
// };

export default firebaseConfig;

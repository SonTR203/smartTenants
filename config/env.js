import {
  API_KEY_DEV,
  API_KEY_PROD,
  AUTH_DOMAIN_DEV,
  AUTH_DOMAIN_PROD,
  PROJECT_ID_DEV,
  PROJECT_ID_PROD,
  STORAGE_BUCKET_DEV,
  STORAGE_BUCKET_PROD,
  MESSAGING_SENDER_ID_DEV,
  MESSAGING_SENDER_ID_PROD,
  APP_ID_DEV,
  APP_ID_PROD,
  MEASUREMENT_ID_DEV,
  MEASUREMENT_ID_PROD,
} from "@env";

function getEnvironment() {
  if (__DEV__) {
    return {
      apiKey: API_KEY_DEV,
      authDomain: AUTH_DOMAIN_DEV,
      projectId: PROJECT_ID_DEV,
      storageBucket: STORAGE_BUCKET_DEV,
      messagingSenderId: MESSAGING_SENDER_ID_DEV,
      appId: APP_ID_DEV,
      measurementId: MEASUREMENT_ID_DEV,
    };
  } else {
    return {
      apiKey: API_KEY_PROD,
      authDomain: AUTH_DOMAIN_PROD,
      projectId: PROJECT_ID_PROD,
      storageBucket: STORAGE_BUCKET_PROD,
      messagingSenderId: MESSAGING_SENDER_ID_PROD,
      appId: APP_ID_PROD,
      measurementId: MEASUREMENT_ID_PROD,
    };
  }
}

const firebaseConfig = getEnvironment();

export default firebaseConfig;


import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// Primary source for keys is environment variables.
const firebaseConfig = {
  apiKey: (typeof process !== 'undefined' && process.env) ? (process.env.REACT_APP_FIREBASE_API_KEY || process.env.API_KEY) : '',
  authDomain: (typeof process !== 'undefined' && process.env) ? process.env.REACT_APP_FIREBASE_AUTH_DOMAIN : '',
  projectId: (typeof process !== 'undefined' && process.env) ? process.env.REACT_APP_FIREBASE_PROJECT_ID : '',
  storageBucket: (typeof process !== 'undefined' && process.env) ? process.env.REACT_APP_FIREBASE_STORAGE_BUCKET : '',
  messagingSenderId: (typeof process !== 'undefined' && process.env) ? process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID : '',
  appId: (typeof process !== 'undefined' && process.env) ? process.env.REACT_APP_FIREBASE_APP_ID : ''
};

// Check if we have at least an API Key to attempt a Cloud connection.
export const isFirebaseConfigured = !!(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10);

let db: Firestore | null = null;
let auth: Auth | null = null;

if (isFirebaseConfigured) {
  try {
    // Only initialize if we have a project ID as well, otherwise Firebase will crash internally
    if (firebaseConfig.projectId && firebaseConfig.projectId !== 'your_project_id') {
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(app);
      auth = getAuth(app);
    }
  } catch (error) {
    console.warn("MVS Aqua: Cloud services initialization deferred. Running in Local Security Mode.");
  }
}

export { db, auth };

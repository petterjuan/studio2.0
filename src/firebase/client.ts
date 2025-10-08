import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

// This check is important to prevent Firebase from being initialized on the server.
if (typeof window !== 'undefined' && firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('your-')) {
    // Initialize Firebase only on the client side
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
firestore = getFirestore(app);
} else {
    // If on the server or config is not set, provide placeholder objects
    // This can help prevent errors during server-side rendering if client-side
    // components are somehow imported.
    app = {} as FirebaseApp;
    auth = {} as Auth;
    firestore = {} as Firestore;
}

export { app, auth, firestore };

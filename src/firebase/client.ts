'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMG7_GWoVNP7wuTzYIJYZMffwN7Nej7jg",
  authDomain: "studio-4707171117-fa17b.firebaseapp.com",
  projectId: "studio-4707171117-fa17b",
  storageBucket: "studio-4707171117-fa17b.appspot.com",
  messagingSenderId: "858364841517",
  appId: "1:858364841517:web:1e7a6a3e5c801a31e832a4"
};

// Singleton pattern to ensure Firebase is initialized only once
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);

export { app, auth, firestore };

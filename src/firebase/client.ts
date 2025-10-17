'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMG7_GWoVNP7wuTzYIJYZMffwN7Nej7jg",
  authDomain: "studio-4707171117-1526d.firebaseapp.com",
  projectId: "studio-4707171117-1526d",
  storageBucket: "studio-4707171117-1526d.appspot.com",
  messagingSenderId: "834835769907",
  appId: "1:834835769907:web:b4aec87f2f482cb0295146"
};

// Singleton pattern to ensure Firebase is initialized only once
const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);

export { app, auth, firestore };

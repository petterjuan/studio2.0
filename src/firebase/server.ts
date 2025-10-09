import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: App;
let auth: Auth;
let firestore: Firestore;

if (serviceAccount) {
    app = getApps().length
        ? getApps()[0]
        : initializeApp({ credential: cert(serviceAccount) });
    
    auth = getAuth(app);
    firestore = getFirestore(app);
} else {
    console.warn("Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing.");
    // Provide mock/empty objects if not initialized
    app = {} as App;
    auth = {} as Auth;
    firestore = {} as Firestore;
}

export { app, auth, firestore };

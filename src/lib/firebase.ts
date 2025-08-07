
'use client';

import { initializeApp, getApps, getApp, type App } from 'firebase/app';
import { getFirestore, type Firestore, enableIndexedDbPersistence, setLogLevel, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, type Functions, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: App;
let db: Firestore;
let functions: Functions;
let auth: Auth;

if (typeof window !== 'undefined') {
    if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = getApp();
    }

    db = getFirestore(app);
    functions = getFunctions(app);
    auth = getAuth(app);

    // Connect to emulators if running in development
    if (process.env.NODE_ENV === 'development') {
        try {
            console.log("Connecting to Firestore emulator on localhost:8081");
            connectFirestoreEmulator(db, 'localhost', 8081);
            console.log("Connecting to Functions emulator on localhost:5002");
            connectFunctionsEmulator(functions, 'localhost', 5002);
            console.log("Connecting to Auth emulator on localhost:9099");
            connectAuthEmulator(auth, 'http://localhost:9099');
        } catch (error) {
            console.error("Error connecting to Firebase emulators:", error);
        }
    }


    // Enable debug logging
    setLogLevel("debug");

    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          console.warn('Firestore persistence failed: multiple tabs open.');
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          console.warn('Firestore persistence not available in this browser.');
        }
      });
}


// @ts-ignore
export { app, db, functions, auth };

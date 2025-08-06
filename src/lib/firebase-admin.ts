import * as admin from 'firebase-admin';
import { config } from 'dotenv';

config();

if (!admin.apps.length) {
  if (
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  ) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // The private key must be formatted correctly to be parsed by Firebase
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(
            /\\n/g,
            '\n'
          ),
        }),
        databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
      });
    } catch (error: any) {
      console.error('Firebase admin initialization error', error.stack);
    }
  } else {
    console.warn(
      'Firebase Admin SDK not initialized. Missing environment variables.'
    );
  }
}

const adminDb = admin.apps.length ? admin.firestore() : null;

export default adminDb;

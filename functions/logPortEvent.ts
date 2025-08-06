import admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

interface PortEvent {
  port: number;
  status: string;
  pid?: number;
}

export const logPortEvent = async (event: PortEvent) => {
  try {
    await db.collection('portEvents').add({
      ...event,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log(`Logged port event: Port ${event.port}, Status: ${event.status}, PID: ${event.pid || 'N/A'}`);
  } catch (error) {
    console.error('Error logging port event:', error);
  }
};
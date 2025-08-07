
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const pulseVault = functions.https.onCall(async (data, context) => {
    if (!db) {
        throw new functions.https.HttpsError('internal', 'Firestore admin is not initialized.');
    }
    const docRef = db.doc("vault/config");
    
    try {
        const snapshot = await docRef.get();
        const config = snapshot.data();

        if (config?.credentialStatus !== "injected") {
            return { status: "vault-blocked", reason: "credentialsMissing" };
        }

        await docRef.update({ meshEntropy: "synced" });
        return { status: "vault-pulsed" };
    } catch (error) {
        console.error("Error pulsing vault:", error);
        throw new functions.https.HttpsError('unknown', 'An unknown error occurred while pulsing the vault.', error);
    }
});

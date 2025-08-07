import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const pulseVault = functions.https.onRequest((req, res) => {
  const status = {
    timestamp: Date.now(),
    vault: "online",
    config: {
      ports: [8081, 9099, 5002],
      audit: true,
    },
  };

  admin.firestore().collection("vault").doc("config").set(status)
    .then(() => res.status(200).send("Vault status updated"))
    .catch(err => res.status(500).send(`Error: ${err}`));
});

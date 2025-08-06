const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.burst = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  const { symbol, strategyTag, qty, score, profitSim, timestamp } = req.body;

  if (!symbol || !strategyTag || !qty || !score || !profitSim || !timestamp) {
    return res.status(400).send("Missing burst parameters");
  }

  const path = `/bursts/${symbol}/${strategyTag}/${timestamp}`;
  try {
    await admin.database().ref(path).set({
      symbol, strategyTag, qty, score, profitSim, timestamp
    });
    return res.status(200).send({ status: "✅ Burst stored", path });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});
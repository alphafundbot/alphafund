// functions/logGitEvent.ts
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp } from "firebase-admin/app";

initializeApp();

export const logGitEvent = async ({ repo, event }) => {
  const db = getFirestore();
  const currentUser = process.env.USER || "unknown";
  await db.collection("gitEvents").add({
    timestamp: Date.now(),
    repo,
    event,
    user: currentUser,
  });
};
import fetch from "node-fetch";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

let lastUrl = null;

async function fetchNgrokUrl() {
  try {
    const res = await fetch("http://localhost:4040/api/tunnels");
    const data = await res.json();

    const tunnel = data.tunnels.find(t => t.public_url.startsWith("https://"));
    return tunnel?.public_url || null;

  } catch (err) {
    console.error("Failed to fetch ngrok URL:", err.message);
    return null;
  }
}

async function updateFirestore(url) {
  const docRef = db.collection("config").doc("ngrok");
  await docRef.set({
    url
  });
}

async function syncLoop() {
  const url = await fetchNgrokUrl();

  if (url && url !== lastUrl) {
    await updateFirestore(url);
    lastUrl = url;
  }

  setTimeout(syncLoop, 10_000); // 10 sec
}

syncLoop();


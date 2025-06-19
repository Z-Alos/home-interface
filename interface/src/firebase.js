import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCI-jwdRGVQnoqByvC3N39M5Z253FNtiNI",
  authDomain: "zalos-home-interface.firebaseapp.com",
  projectId: "zalos-home-interface",
  storageBucket: "zalos-home-interface.firebasestorage.app",
  messagingSenderId: "293542841502",
  appId: "1:293542841502:web:748967d0a71bb3e0da7f8f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }

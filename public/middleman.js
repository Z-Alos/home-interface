import { doc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { db } from "./firebase.js";

let NGROK_DOMAIN = "";

const docRef = doc(db, "config", "ngrok");

onSnapshot(docRef, (doc) => {
  if (doc.exists()) {
    const data = doc.data();
    NGROK_DOMAIN = data.url;
    console.log("ngrok URL:", data.url);
  }
});


// relay1 -> tubelight
const relay1 = document.getElementById("light1");
relay1.addEventListener("click", (e) => toggleRelay(e, 1));

// relay2 -> fan
const relay2 = document.getElementById("fan");
relay2.addEventListener("click", (e) => toggleRelay(e, 2));
    
const roomStartupProtocol = document.getElementById("room-startup-protocol");
roomStartupProtocol.addEventListener("click", (e) => protocol(e, 0));

const roomShutdownProtocol = document.getElementById("room-shutdown-protocol");
roomShutdownProtocol.addEventListener("click", (e) => protocol(e, 1));

//ngrok domain fetching


async function toggleRelay(e, id){
    e.preventDefault();

    if (!NGROK_DOMAIN) {
        return;
    }

    // const res = await fetch(`${NGROK_DOMAIN}/relay/${id}/toggle`);
    // const data = await res.text();

    const res = await fetch(`${NGROK_DOMAIN}/relay/${id}/toggle`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
        },
    });

    const data = await res.json();
    console.log(data, id);

    if(data.id !== id) console.error("different device")
    console.log(data);
    const relayState = e.target.querySelector('.state');
    relayState.innerText = `${data.relayStatus}`;
    if(data.relayStatus == "ON") e.target.classList.add("on");
    else e.target.classList.remove("on");
}

async function protocol(e, protocol_id){
    e.preventDefault();
    // const res = await fetch(`${NGROK_DOMAIN}/protocol/${protocol_id}`);
    const res = await fetch(`${NGROK_DOMAIN}/protocol/${protocol_id}`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
        },
    });
    const data = await res.json();
    console.log(data);
}

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

// relay0 -> tubelight
const relay0 = document.getElementById("light");
relay0.addEventListener("click", (e) => toggleRelay(e, 0));

// relay1 -> fan
const relay1 = document.getElementById("fan");
relay1.addEventListener("click", (e) => toggleRelay(e, 1));
    
const roomStartupProtocol = document.getElementById("room-startup-protocol");
roomStartupProtocol.addEventListener("click", (e) => protocol(e, 0));

const roomShutdownProtocol = document.getElementById("room-shutdown-protocol");
roomShutdownProtocol.addEventListener("click", (e) => protocol(e, 1));

fetchRelayState();

async function fetchRelayState() {
    const relaysDOM = [relay0, relay1]; 

    const res = await fetch(`${NGROK_DOMAIN}/relay/status`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
        },
    });

    const relays = await res.json();
    console.log(relays);

    for (let i = 0; i < Object.keys(relays).length; i++) {
        const state = relays[`statusRelay${i}`];

        const relayElement = relaysDOM[i];
        if (!relayElement) continue; 

        switchState(relayElement, state);
        
    }
}

function switchState(ele, state){
    const element = ele.querySelector('.state');

    if (state === "on") {
        ele.classList.add("on");
        element.innerText = "ON";
    } else {
        ele.classList.remove("on");
        element.innerText = "OFF";
    }
}

//ngrok domain fetching
async function toggleRelay(e, id){
    e.preventDefault();
    if (!NGROK_DOMAIN) {
        console.log("Ngrok Domain Not Found!!!");
        return;
    }

    console.log("Ngrok domain: ", NGROK_DOMAIN);

    const operation = e.target.classList.contains("on") ? "turnOff" : "turnOn";

    console.log(operation);
    const res = await fetch(`${NGROK_DOMAIN}/relay/${id}/${operation}`, {
        method: "GET",
        headers: {
            "ngrok-skip-browser-warning": "69420",
        },
    });

    const data = await res.json();

    if(data.id !== id) console.error("different device")
    console.log(data);

    switchState(e.target, data.relayStatus);
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

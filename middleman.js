// relay1 -> tubelight
const relay1 = document.getElementById("light1");
relay1.addEventListener("click", (e) => toggleRelay(e, 1));

const relay2 = document.getElementById("light2");
relay2.addEventListener("click", (e) => toggleRelay(e, 2));

async function toggleRelay(e, id){
    e.preventDefault();
    const res = await fetch(`/relay/${id}/toggle`);
    const data = await res.json();
    if(data.id !== id) console.error("different device")
    console.log(data);
    const relayState = e.target.querySelector('.state');
    
    relayState.innerText = `${data.relayStatus}`;
    if(data.relayStatus == "ON") e.target.classList.add("on");
    else e.target.classList.remove("on");
}


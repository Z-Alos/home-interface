// relay1 -> tubelight
const relay1 = document.getElementById("light1");
relay1.addEventListener("click", (e) => toggleRelay(e, 1));

async function toggleRelay(e, id){
    e.preventDefault();
    const res = await fetch(`/relay/${id}/toggle`);
    const data = await res.json();
    if(data.id !== id) console.error("different device")
    console.log(data);
    relay1.innerText = `Light: ${data.relayStatus}`;
}


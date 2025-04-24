import express from "express";
import { SerialPort } from "serialport";
import path from 'path';
// import ReadLine from "@serialport/parser-readline"

//express
const app = express();
app.use(express.static('./'));

const PORT = 6969;
app.listen(PORT, () => {
    console.log("Server Listening Like Google On Port:", PORT);
});


//Arduino Setup
let portIsOpen = false;
const relay = [false,false];

const port = new SerialPort({path: '/dev/ttyACM0', baudRate: 9600 });
// const parser = port.pipe(new ReadLine({ delimeter: '\n' }));

port.on("open", () => {
    portIsOpen = true;
    console.log("Arduino's ready babes!!!");
});

//Routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./index.html'));
});

app.get('/relay/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    if(relay[id - 1] === undefined) return res.status(404).json({ error: "Relay not found" });;
    
    if(portIsOpen){
        port.write(JSON.stringify({ relayId: id }), (err) => {
            if(err) console.error("Something went wrong: ", err);
            else "processing...";
        });
    }

    relay[id] = !relay[id];
    res.json({id, relayStatus: relay[id] ? "ON" : "OFF"});
});




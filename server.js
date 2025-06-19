import express from "express";
import cors from "cors";
import { SerialPort } from "serialport";
import path from 'path';
import { ReadlineParser } from '@serialport/parser-readline'

// express
const app = express();
app.use(express.static('./interface/'));
app.use(cors()); //We are badass

const PORT = 6969;
app.listen(PORT, () => {
    console.log("Server Listening Like Google On Port:", PORT);
});

// Arduino Setup
let portIsOpen = false;
const relays = [true, true];

let port;
let parser; 

connectToArduino();

function connectToArduino(){
    port = new SerialPort({path: '/dev/ttyACM0', baudRate: 9600 });
    parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    port.on("open", () => {
        portIsOpen = true;
        console.log("Arduino's ready babes!!!");

        port.on("close", () => {
            portIsOpen = false;
            console.log("Reconnecting in 3 secs...");
            setTimeout(connectToArduino, 3000);
        });

        port.on('error', () => {
            port.close();
        });

        parser.on("data", data => {
            console.log("Serial Parser (Raw): ",data);
            try {
                const jsonData = JSON.parse(data);
                // console.log("Serial Parser (Json): ",jsonData);
            } catch (error) {

            }
        });
    });

    // Fetching Relay State
    // setTimeout(()=>{
    //     port.write(JSON.stringify({ expect: "relayState" }) + '\n', (err) => {
    //         if(err){
    //             console.log("Unable to fetch Relay State: ", err);
    //         }
    //         else{
    //             console.log("Fetching Relay State");
    //         }
    //     });
    // }, 4000);
}


// Routes
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./interface/index.html'));
});

app.get('/relay/status', (req, res) => {
    let relayStatus = {};
    for (let i = 0; i < relays.length; i++) {
        relayStatus[`statusRelay${i}`] = relays[i] ? "on" : "off";
    }

    res.json(relayStatus);
});

app.get('/relay/:id/:operation', (req, res) => {
    const id = parseInt(req.params.id);
    const operation = req.params.operation;  // Operation (turnOn, turnOff)

    if(relays[id] === undefined) return res.status(404).json({ error: "Relay not found" });;

    const command = [{relayId: id, relayOperation: operation}];
    
    handle_relay(command);

    res.json({id, relayStatus: relays[id] ? "on" : "off"});
});

// Protocols
app.get('/protocol/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if(id !== 0 && id !== 1) return res.status(404).json({ error: "Invalid Protocol" });;

    console.log("Initializing Protocol", id)
    
    const protocol_1 = [{relayId: 0, relayOperation: "turnOn"}, {relayId: 1, relayOperation: "turnOn"}];
    const protocol_2 = [{relayId: 0, relayOperation: "turnOff"}, {relayId: 1, relayOperation: "turnOff"}];

    switch (id) {
        case 0:
            handle_relay(protocol_1); 
            break;

        case 1:
            handle_relay(protocol_2); 
            break;
    }

});

// Functions
async function handle_relay(commands) {
    if(portIsOpen){
        for (const command of commands) {
            const data = JSON.stringify({ expect: "operation", relayId: command.relayId, relayOperation: command.relayOperation});
             
            console.log(data);
            port.write(data, (err) => {
                if(err) console.error("Something went wrong: ", err);
                else "processing...";
            });
            relays[command.relayId] = command.relayOperation === "turnOn" ? true : false;
            console.log(`Toggling Relay ${command.relayId}...`);
            await sleep(1000);
        }
    }
}

// Utility Functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



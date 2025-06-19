#include <ArduinoJson.h>

const int pin[2] = {7, 8};
const int totalRelay = sizeof(pin) / sizeof(pin[0]);

void setup() {
  for (int i = 0; i < totalRelay; i++) {
    pinMode(pin[i], OUTPUT);
    digitalWrite(pin[i], LOW);  
    delay(1000);
  }
  Serial.begin(9600);
  Serial.setTimeout(100);
}

void loop() {
  if (Serial.available()) {
    String input = Serial.readStringUntil('\n'); 

    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, input);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }

    const char* expect = doc["expect"];

    if(String(expect) == "relayState"){
      for (int i = 0; i < totalRelay; i++) {
        Serial.println("{\"relayId\": " + String(i) + ", \"relayStatus\": " + String(digitalRead(pin[i])) + "}");
      }
    }

    else if(String(expect) == "operation"){
      int relayId = doc["relayId"];
      String relayOperation = doc["relayOperation"];
      Serial.println(relayOperation);
      int relayIndex = relayId; 

      if (relayIndex >= 0 && relayIndex < totalRelay) {
        if(relayOperation == "turnOff"){
          digitalWrite(pin[relayIndex], HIGH);
        }
        else{
          digitalWrite(pin[relayIndex], LOW);
        }

        Serial.println("{\"relayId\": " + String(relayId) + ", \"relayStatus\": " + String(digitalRead(pin[relayIndex])) + "}");
        Serial.println("Toggled relay: " + String(relayId));
      }
      else {
        Serial.println(F("Invalid relayId"));
      }
    }
  }

  delay(20); // Let Arduino Rest
}


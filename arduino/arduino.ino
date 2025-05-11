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
    StaticJsonDocument<200> doc;

    DeserializationError error = deserializeJson(doc, Serial);

    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }

    int relayId = doc["relayId"];
    int relayIndex = relayId - 1;  // Convert to 0-based index

    if (relayIndex >= 0 && relayIndex < totalRelay) {
      digitalWrite(pin[relayIndex], !digitalRead(pin[relayIndex]));
      Serial.print("Toggled relay: ");
      Serial.println(relayId);
    }
    else {
      Serial.println(F("Invalid relayId"));
    }
  }

  delay(20); // Let Arduino Rest
}


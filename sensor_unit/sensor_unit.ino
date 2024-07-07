#include <ESP8266Firebase.h> // Firebase Connection
#include <ESP8266WiFi.h>  // Wifi Connectivity
#include <AHTxx.h> // Temperature/ Humidity Sensor AHTB21
#include <Wire.h> // For IC Communication in AHTB21B
#include "time.h" // Date/ Time Library

// Network Configuration
#define FIREBASE_HOST "https://cocomanage-516c5-default-rtdb.firebaseio.com"      
#define FIREBASE_AUTH "AIzaSyDh3E_WGJWBxcEsYGWQvHSAyFJMk5uJ7Y0"            
#define WIFI_SSID "Dialog 4G 202"         
#define WIFI_PASSWORD "3FdB6bFD"

// Rainfall
#define rainfallA A0

// Soil Moisture
#define soilMoistureD 0 //D3 corresponds to GPIO0

// Temperature and Humidity (ASAIR AHTB21)
// PINS: SCL - D1, SDA - D2, GND - GND, VCC - 3V
AHTxx aht10(AHTXX_ADDRESS_X38, AHT1x_SENSOR); //sensor address, sensor type

// Firebase Initialization
Firebase firebase(FIREBASE_HOST);

// NTP Client to get time
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 19800; //;  1704047400
const int daylightOffset_sec = 0;
bool isTimeDataRecieved = false;

// Variables to Store Date and Time
char year[6];
char month[12];
char day[3];

void setup() {
  // Serial Communication Initialization
  Serial.begin(115200);

  // AHTB21 Humidity and Temperature Sensor Initialization
  #if defined(ESP8266)
  WiFi.persistent(false);  //disable saving wifi config into SDK flash area
  WiFi.forceSleepBegin();  //disable AP & station by calling "WiFi.mode(WIFI_OFF)" & put modem to sleep
  #endif
  
  while (aht10.begin() != true) 
  {
    Serial.println(F("AHT1x not connected or fail to load calibration coefficient")); //(F()) save string to flash & keeps dynamic memory free
    delay(5000);
  }

  // WiFi Initialization
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);          

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi");                        

  // Initialize Time Library
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

int getRainfall(){
  float rainfallSensorReading = analogRead(rainfallA);
  int outputRainfallValue = map(rainfallSensorReading, 0, 1023, 255, 0); // map the 10-bit data to 8-bit data
  return outputRainfallValue;
}

int getSoilMoisture(){
  int soilSensorReading = analogRead(soilMoistureD);
  return soilSensorReading;
}

float getTemperature(){
  float temperatureSensorReading = aht10.readTemperature();
  return temperatureSensorReading;
}

float getHumidity(){
  float humiditySensorReading = aht10.readHumidity();
  return humiditySensorReading;
}

void getLocalTime() {
  struct tm timeinfo;
  
  if (!getLocalTime(&timeinfo)) {
    Serial.println("Failed to obtain time");
    return;
  }

  isTimeDataRecieved = true;

  // Format and print the time
  strftime(year, sizeof(year), "%Y", &timeinfo);
  strftime(month, sizeof(month), "%B", &timeinfo);
  strftime(day, sizeof(day), "%d", &timeinfo);
}

void loop() {

  // Get current time
  getLocalTime();

  // Get Sensor Readings
  int rainfall = getRainfall();
  int soilMoisture = getSoilMoisture();
  float temperature = getTemperature();
  float humidity = getHumidity();

  if(isTimeDataRecieved){
    // Store Rainfall Data in Firebase
    String rainfallPath = "SensorData/Rainfall/" + String(year) + "/" + String(month) + "/" + String(day);

    if (firebase.setInt(rainfallPath, rainfall)) {
      Serial.println("Rainfall data sent to Firebase successfully.");
    } else {
      Serial.print("Failed to send rainfall data to Firebase: ");
    }

    // Store Soil Moisture Data in Firebase
    String soilMoisturePath = "SensorData/SoilMoisture/" + String(year) + "/" + String(month) + "/" + String(day);

    if (firebase.setInt(soilMoisturePath, soilMoisture)) {
      Serial.println("Soil Moisture data sent to Firebase successfully.");
    } else {
      Serial.print("Failed to send Soil Moisture data to Firebase: ");
    }

    // Store Temperature Data in Firebase
    String temperaturePath = "SensorData/Temperature/" + String(year) + "/" + String(month) + "/" + String(day);

    if (firebase.setInt(temperaturePath, temperature)) {
      Serial.println("Temperature data sent to Firebase successfully.");
    } else {
      Serial.print("Failed to send Temperature data to Firebase: ");
    }

    // Store Humidity Data in Firebase
    String humidityPath = "SensorData/Humidity/" + String(year) + "/" + String(month) + "/" + String(day);

    if (firebase.setInt(humidityPath, humidity)) {
      Serial.println("Humidity data sent to Firebase successfully.");
    } else {
      Serial.print("Failed to send Humidity data to Firebase: ");
    }

    Serial.println(String(year) + "/" + String(month) + "/" + String(day));

    Serial.print("Rainfall: ");
    Serial.print(rainfall);
    Serial.println();

    Serial.print("Soil Moisture: ");
    Serial.print(soilMoisture);
    Serial.println();

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println();

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println();

    delay(5000); // Send data every 5 seconds
  }
}

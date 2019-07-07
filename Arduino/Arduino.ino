

// set up pins for LED
const int ledPin = 11; // analog PWM pin 11
int ledbrightness = 0; // how bright the second LED is
int incomingByte; // variable for holding the data from p5.js

void setup() {


  Serial.begin(9600); // initialize the serial port for communication
  pinMode (ledPin, OUTPUT); // set up the LED pin to be an output:  pinMode(ledPin, OUTPUT);
}

void loop() {
  // read the input from p5.js and use that data to control the LED light
  if (Serial.available() > 0) { // see if there's incoming serial data
    incomingByte = Serial.read(); // read it and store it in the variable
    ledbrightness = map(incomingByte, 0, 255, 0, 200); // map the incoming value to a value ranging 0 to 255, PWM values to control brightness. This can also be done direclty in the p5.js scirpt file
  } else { }
  analogWrite(ledPin, ledbrightness);// write the input brightness value to the LED
}

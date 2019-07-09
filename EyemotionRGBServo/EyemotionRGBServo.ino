#include <Servo.h>


const int rPin = 9;
const int gPin = 10;
const int bPin = 11;

Servo servoX;
Servo servoY;

String incomingR;
String incomingG;
String incomingB;
String incomingX;
String incomingY;



int varR = 0;
int varG = 0;
int varB = 0;
int varX = 0;
int varY = 0;


void setup() {
  Serial.begin(9600);
  pinMode (rPin, OUTPUT);
  pinMode (gPin, OUTPUT);
  pinMode (bPin, OUTPUT);

  servoX.attach(5);
  servoY.attach(6);

}

void loop() {

  if (Serial.available() > 0) {

    incomingR = Serial.readStringUntil(',');
    Serial.read();
    incomingG = Serial.readStringUntil(',');
    Serial.read();
    incomingB = Serial.readStringUntil(',');
    Serial.read();
    incomingX = Serial.readStringUntil(',');
    Serial.read();
    incomingY = Serial.readStringUntil('\0');
    Serial.read();
    varR = incomingR.toInt();
    varG = incomingG.toInt();
    varB = incomingB.toInt();
    varX = incomingX.toInt();
    varY = incomingY.toInt();


    analogWrite(rPin, varR);
    analogWrite(gPin, varG);
    analogWrite(bPin, varB);

    servoX.write(varX);
    servoY.write(varY);


  }


}

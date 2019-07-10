let video;
let yolo;
let status;
let status2;
let objects = [];
let obX = 0;
let obY = 0;

var serial;          // variable to hold an instance of the serialport library
var portName = '/dev/cu.wchusbserial1410';  // fill in your serial port name here
var inData;   // variable to hold the input data from Arduino
var outData = 0;  // variable to hold the output data to Arduino
var pos;
var pos2;



function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  // Create a YOLO method
  yolo = ml5.YOLO(video, startDetecting);
  // Hide the original video
  video.hide();
  status = select('#status');

  //set up communication port
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);  // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port

}

function draw() {
  image(video, 0, 0, 640, 480);
  for (let i = 0; i < objects.length; i++) {
if (objects[i].className === "bottle") {
    noStroke();
    fill(0, 255, 0);
    text(objects[i].className, objects[i].x*width, objects[i].y*height - 5);
    noFill();
    strokeWeight(4);
    stroke(0,255, 0);
    let nX = objects[i].x*width;
    let nY = objects[i].y*height;
    obX = lerp(obX, nX, 0.5);
    obY = lerp(obY, nY, 0.5);
    pos = map(obX,0,640,0,255);
    pos2 = map(obX,0,640,0,10);
    rect(obX, obY, objects[i].w*width, objects[i].h*height);

 if (pos2 >=4 && pos2 <=6){
  // set up serial output, to write the control value to the port
  outData = pos;
  serial.write(pos);
   }

else if(objects[i].className !="bottle"){
serial.write(0);}
  else  {
serial.write(0);
  }
    status.html(pos2);
console.log(objects[i].className);
}

}
}





function startDetecting() {
  status.html('Model loaded!');
  detect();
}

function detect() { 
  yolo.detect(function(err, results){
    objects = results;
    detect();
  });
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    print(i + " " + portList[i]);
  }
}

function serverConnected() {
  print('connected to server.');
}

function portOpen() {
  print('the serial port opened.')
}

function serialEvent() {
  inData = Number(serial.read());
}

function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}

function portClose() {
  print('The serial port closed.');
}


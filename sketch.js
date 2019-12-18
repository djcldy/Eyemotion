let maxAngleX = 175;
let maxAngleY = 120;
let minAngleX = 30;
let minAngleY = 30;
var posY = 90;
var posX = 90;
var rotX = 0;
var rotY = 0;
var midBuffer = 10;
var midHeight
var midWidth

let cut;
let ctracker;



var serial;          // variable to hold an instance of the serialport library
var status 
var draw = false 
var cols = [255,255,255]
var posX = 10
var posY = 10
var posZ = 10
var k,j 
var state = null

var pList = []
var faces = []

var faceDected = false 

// Sketch Two
var t = function( p ) {

  k = 0
  j =0

  // ArraList<PVector>()
  p.setup = function() {
    
    p.createCanvas(p.windowWidth, p.windowHeight/2, p.WEBGL)
    p.background(0) // make indigo 
    p.noStroke()

  }

  p.draw = function() {

      p.orbitControl();

      // console.log(posX,posY,posZ)

      // if (draw){

        p.background(5)
        p.fill(255,0,0);
        p.push()
        p.scale(0.5)
        // p.rotateX(k)

        var w = p.map(posX,0,480,0,p.windowWidth)
        var h = p.map(posY,0,640,0,p.windowHeight)
        var depth = p.map(posZ,20,100,-50,500)

        pList.push([w,h,100,cols[0],cols[1],cols[2]])

        pList.forEach(pt=>{

          p.push()
          p.translate(pt[0]-p.width/2,pt[1]-p.height/2,pt[2])
          p.fill(pt[3],pt[4],pt[5],200)
          p.sphere(5)
          p.pop()
        
        })

        p.pop()

        k += 0.01

  }
}


var myp5 = new p5(t, 'playField');

// save this file as sketch.js
// Sketch One

var s = function(q){

  // MOBILE NET 
  let mobilenet;
  let video;
  let classifier;
  let poseNet;
  let noseX = 0;
  let noseY = 0;
  let eyelX = 0;
  let eyelY = 0;
  let predictions = [];
  let probabilities = [];
  let classButtons = [];
  let trainButton;
  let trainingProgress;
  let canvas;
  let cut;
  let ctracker;
  let classes = ['Angry','Happy','Goofy'];
  let classesCount = [0, 0, 0];
  // what is this number? 
  var portName = '/dev/cu.wchusbserial1410';  // fill in your serial port name here

  var inData;   // variable to hold the input data from Arduino
  var outData = 0;  // variable to hold the output data to Arduino
  var outData2 = 0;  // variable to hold the output data to Arduino
  var pos;
  let metaBold;


q.setup = function() {

    video = q.createCapture(q.VIDEO);
    video.parent('mainCanvas');
    video.size(640, 480);
    video.position(0, 0);
    video.hide();
    canvas = q.createCanvas(640, 480);
    canvas.parent('mainCanvas');
    q.background(20);

    var midHeight = (q.height/2);
    var midWidth = (q.width/2);

    metaBold = q.loadFont("arialbd.ttf");
    q.textFont(metaBold, 44); 

    let options = {
        // imageScaleFactor: 1,
        minConfidence: 0.9
    }
    

    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', gotPoses);

    // video.hide();
    mobilenet = ml5.featureExtractor('MobileNet', {

      version: 1,
      alpha: 1.0,
      topk: 3,
      learningRate: 0.0001,
      hiddenUnits: 100,
      epochs: 20,
      numClasses: 3,
      batchSize: 0.4,
    
    }, () => {
      console.log('Model is ready!');
    
    });

    mobilenet.numClasses = classes.length;
    classifier = mobilenet.classification(video, ()=> console.log('Video is ready!'));

    trainingProgress = q.select('#training-progress');

    for (let i = 0; i < 3; i++) {

      predictions.push(q.select('#class' + (i - (-1)) + '-name'));
      probabilities.push(q.select('#class' + (i - (-1)) + '-probability'));
      classButtons.push(q.select('#class' + (i - (-1)) + 'button'));
      classButtons[i].mousePressed(function () {
        // while(cut.pixels.length == 0);
        // console.log(cut);
        classifier.addImage(classes[i], () =>{ 
          // console.log('Added!');
        })
        
        classButtons[i].html(classes[i] + ' (' + (++classesCount[i]) + ')')

      })

    }

    trainButton = q.select('#train-button');
    trainButton.mousePressed(function () {
      let progress = 0;
      classifier.train((loss) => {
        if (loss === null) {
          trainingProgress.attribute('style', 'width:100%');
          trainingProgress.html('Finished');
          console.log('Training finished!');
          classifier.classify(gotResults);
        } else {
          progress = q.lerp(progress, 100, .2);
          trainingProgress.attribute('style', 'width:' + progress + '%');
          // trainingProgress.attribute('style', 'width:'+progress+'%');
          console.log(loss);
        }
      })
    })

    // //     //set up communication port
    serial = new p5.SerialPort();       // make a new instance of the serialport library
    serial.on('list', console.logList);  // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen);        // callback for the port opening
    serial.on('data', serialEvent);     // callback for when new data arrives
    serial.on('error', serialError);    // callback for errors
    serial.on('close', portClose);      // callback for the port closing
    serial.list();                      // list the serial ports
    serial.open(portName);              // open a serial port
  }

  q.drawFace = function(x,y,r,i){
    // console.log('status:', status )
  
    switch (i) 
    {
        case 0:
            q.stroke(255,0,0)
            q.fill(255,0,0,25)
            break;

        case 1:
            q.stroke(0,255,0)
            q.fill(0,255,0,25)
            break;

        case 2:
            q.stroke(0,0,255)
            q.fill(0,0,255,10)
            break;

        default:
            q.stroke(255)
            q.fill(255,10)
            break;
          }

  }

  q.draw = function() {
    // console.log('hi!')

    q.clear();
    q.image(video, 0, 0);

//     positions = ctracker.getCurrentPosition();
//     // console.log(JSON.stringify(positions,null,4))
    
    if (faces.length >0){
      var face = faces[0]
      // q.drawFace(face.noseX,face.noseY,face.distance,null)
      var d = face.distance 

      var xmax = face.noseX + d*1.5 
      var ymax = face.noseY + d*2 
      var xmin = face.noseX - d*1.5
      var ymin = face.noseY - d*2  

      if (xmax > q.width){
        xmax = q.width 
      }

      if (ymax > q.height){
        ymax = q.height
      }

      if (ymin < 0){
        ymin = 0
      }

      if (xmin < 0){
        xmin = 0 
      }

      var cw = xmax - xmin
      var ch = ymax - ymin 

      if (cw > 0 && ch > 0){

        cut = q.get(xmin, ymin, cw, ch);
        cut.loadPixels()
        cut.updatePixels()
        q.noFill()
        q.strokeWeight(3)
        q.stroke(cols[0],cols[1],cols[2])
        q.rect(xmin, ymin, cw, ch)
        q.background(0, 0, 0, 150)
        q.image(cut, xmin, ymin)

      } 

    } else {

      q.background(0, 0, 0, 200)
    
    }
     


  }

  // Serial Port Functions 

  function printList(portList) {

  // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {

      // Display the list the console:
      console.log(i + " " + portList[i]);
 
    }
 
  }

  function serverConnected() {

    console.log('connected to server.')

  }

  function portOpen() {

    console.log('the serial port opened.')

  }

  function serialEvent() {

    inData = Number(serial.read())

  }

  function serialError(err) {

    console.log('Something went wrong with the serial port. ' + err);

  }

  function portClose() {

    console.log('The serial port closed.')

  }


  function modelReady() {

    // body...
    console.log("model is ready")

  }

  function serialWrite(){

    console.log('serial write!')


  }


  // Pose Net  

  function gotPoses(poses) {
    // console.log('num faces', poses.length);
    faces = []
    
    if (poses.length > 0) {

      // console.log(poses[0])
        
      // console.log(JSON.stringify(poses[0],null,4))      
      for (var i =0; i < poses.length; i++){

        // if (poses[i].pose.keypoints[0].score > 0.99){

        // }
        var score = poses[i].pose.keypoints[0].score
        // console.log('score:',score)
        // console.log("no score", JSON.stringify(poses[i].pose.keypoints[0].score))
        if (score > 0.99){

          let nX = poses[i].pose.keypoints[0].position.x;
          let nY = poses[i].pose.keypoints[0].position.y;
          let eX = poses[i].pose.keypoints[1].position.x;
          let eY = poses[i].pose.keypoints[1].position.y;

          var obj = {}
          obj.noseX = nX 
          obj.noseY = nY
          obj.eyelX = eX
          obj.eyelY = eY
          obj.distance = q.dist(nX,nY,eX,eY)

          faces.push(obj)  

        }

      }

      console.log("faces:", faces.length)
      if (faces.length>1){

      faces.sort(function(a,b){
        return b.dist - a.dist   
      })
      console.log("multiple faces")
        for(var i =0; i < faces.length; i++){
          console.log("i: ", faces[i].distance) 
        }
      }
      // faces.push(obj)
      faceDected = true 
    
    } else { 

      faceDected = false 
      faces = []

    }

    // console.log('number of faces: ', faces.length)
  
  }

  // MobileNet Function 

  function gotResults(error, result) {

    status = result 
  
  // var mood = null

    if (error) {
      console.log(error);
      draw = false 
    } else {
      draw = true 

      for (let i = 0; i < 3; i++) {
// 
        // console.log("got results")
        predictions[i].html(classes[i]);
        probabilities[i].html((result == classes[i] ? 100 : 0) + '%');
        probabilities[i].attribute('aria-valuenow', (result == classes[i] ? 100 : 0));
        probabilities[i].attribute('style', 'width:' + (result == classes[i] ? 100 : 0) + '%');

        if (result == classes[i]){
      
          cols[i] = 255
      
          state = i 
        } else { 
          cols[i] = 0
        }

      }
      classifier.classify(gotResults);
    }

    var servoX = q.map(noseX, 0, q.width, 180, 0); 
    var servoY = q.map(noseY, 0, q.height, 180, 0); 
    var throttlingPerc = 0.2;

    // 

    if (noseX < (midWidth - midBuffer) || noseX > (midWidth + midBuffer)) {
      posX += (servoX - posX) * throttlingPerc;

    }

    if (noseY < (midHeight - midBuffer) || noseY > (midHeight + midBuffer)) {
      posY += (servoY - posY) * throttlingPerc;
      
    }

    posX = constrain(posX, minAngleX, maxAngleX);
    posY = constrain(posY, minAngleY, maxAngleY);
    posX = Math.floor(posX);
    posY = Math.floor(posY);
    rotX = posX.toString();
    rotY = posY.toString();

    var string = cols[0] + ',' + cols[1] + ',' +cols[2] + ',' + rotX + ',' + rotY + '\0';
    console.log("string: ", string);
    
    serial.write(string); 

    //
        

  }
}


var myp5 = new p5(s, 'mainCanvas');
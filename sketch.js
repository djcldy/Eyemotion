
var status 
var draw = false 
var cols = [255,255,255]
var posX = 10
var posY = 10
var posZ = 10
var k,j 
var state = null

var pList = []
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





        // p.push()
        // // p.rotateX(k)
        // // p.rotateZ(j)
        // // p.scale(0.5)
        // // p.scale(p.cos(j)*0.5)
        // // p.scale(p.cos(k)*100)
        // // p.stroke(255,50)
        // // p.strokeWeight(1)
        // // p.line(0,0,0,1000,1000,500)
        // // p.line(0,0,0,1000,-1000,500)
        // // p.line(0,0,0,-1000,1000,500)
        // // p.line(0,0,0,-1000,-1000,500)
       
        // p.noStroke()
        // pList.forEach(pt=>{
        //   p.push()
        //   p.translate(pt[0]-p.width/2,pt[1]-p.height/2,pt[2])
        //   p.fill(pt[3],pt[4],pt[5],50)
        //   p.sphere(25)
        //   p.pop()
        // })

        // p.pop()

        // k += 0.01
        // j += 0.01   

      // }

      // p.push()
      // p.translate(posX-p.width/2,posY-p.height/2,depth)
      // p.fill(cols[0],cols[1],cols[2],150)
      // p.sphere(5)
      // p.pop()

  };
};
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
  var serial;          // variable to hold an instance of the serialport library
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

    metaBold = q.loadFont("arialbd.ttf");
    q.textFont(metaBold, 44); 

    // q.font = q.textFont(q.createFont("arial",32));

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

    mobilenet.numClasses = 3;

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
        });
        classButtons[i].html(classes[i] + ' (' + (++classesCount[i]) + ')');
      });

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

    // setup tracker
    ctracker = new clm.tracker();
    ctracker.init(pModel);
    ctracker.start(video.elt);


    //     //set up communication port
    serial = new p5.SerialPort();       // make a new instance of the serialport library
    serial.on('list', printList);  // set a callback function for the serialport list event
    serial.on('connected', serverConnected); // callback for connecting to the server
    serial.on('open', portOpen);        // callback for the port opening
    serial.on('data', serialEvent);     // callback for when new data arrives
    serial.on('error', serialError);    // callback for errors
    serial.on('close', portClose);      // callback for the port closing
    serial.list();                      // list the serial ports
    serial.open(portName);              // open a serial port


    q.noStroke();
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

    // q.noFill()
    // q.stroke(255)
    q.strokeWeight(3)
    q.ellipse(x,y,r*3,r*4)
    // q.noStroke()
    q.strokeWeight(1)
    q.textSize(14);
    q.push()
        q.translate(x,y)
    q.scale(2)
    q.textAlign('CENTER')
    q.text(status,0,0);
    q.pop()

  }

  q.draw = function() {

    q.clear();
    q.image(video, 0, 0);
    let d = q.dist(noseX, noseY, eyelX, eyelY);
    q.fill(cols[0], cols[1], cols[2]);
    q.drawFace(noseX,noseY,d*2,state)
    positions = ctracker.getCurrentPosition(); //  can we refactor this ?? 
    posX = noseX // lets define as global variables 
    posY = noseY 

  }

  // Serial Port Functions 

  function printList(portList) {

  // portList is an array of serial port names
    for (var i = 0; i < portList.length; i++) {

      // Display the list the console:
      print(i + " " + portList[i]);
 
    }
 
  }

  function serverConnected() {

    print('connected to server.')

  }

  function portOpen() {

    print('the serial port opened.')

  }

  function serialEvent() {

    inData = Number(serial.read())

  }

  function serialError(err) {

    print('Something went wrong with the serial port. ' + err);

  }

  function portClose() {

    print('The serial port closed.')

  }


  function modelReady() {

    // body...
    console.log("model is ready")

  }

  function serialWrite(){

    console.log('serial write!')


  }


  // Mobilenet Functions 

  function gotPoses(poses) {
    // console.log(poses);
    if (poses.length > 0) {

      let nX = poses[0].pose.keypoints[0].position.x;
      let nY = poses[0].pose.keypoints[0].position.y;
      let eX = poses[0].pose.keypoints[1].position.x;
      let eY = poses[0].pose.keypoints[1].position.y;
      noseX = q.lerp(noseX, nX, 0.5);
      noseY = q.lerp(noseY, nY, 0.5);
      eyelX = q.lerp(eyelX, eX, 0.5);
      eyelY = q.lerp(eyelY, eY, 0.5);
    
    }
  
  }

  gotResults = function(error, result) {

    status = result 

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

    // outData = pos.toString();
    // outData2 = pos2.toString();
    // outData = pos.toString()
    // var string = outData + ',' + outData2 + '\0';
    // var string2 = outData2;
    console.log("string: ", string);
    // serial.write(string); 
    

  }
}


var myp5 = new p5(s, 'mainCanvas');
 

    

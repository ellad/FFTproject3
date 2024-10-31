let video;
let bodyPose;
let poses = [];
let connections;
// for scale
let ratio = 1.6;
let globescale;
// for audio
let mic;
let fft;
let audioOn = false;
let waveform;
let spectrum;

let circles1;
let circles2;

//controls 
let vol;
let normVol;
let volSense = 100;
let sliderStep = 10;
let volSenseSlider;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose("MoveNet", {flipped : true});
}

function setup() {
  createCanvas(innerWidth, innerWidth / ratio);
  globescale = min(width, height);

  // Create the video and hide it
  video = createCapture(VIDEO, {flipped: true});
  video.size(width, height);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();

  // Initialize audio input
  fft = new p5.FFT();
  mic = new p5.AudioIn();
  mic.start();
  fft.setInput(mic);

  angleMode(DEGREES);
  circles1 = new Pack(width/2, height/2, 8, 180, 0);
  circles2 = new Pack(width/2, height/2, 8, 180, 180);

  volSenseSlider = createSlider(0, 200, volSense, sliderStep);
  volSense = volSenseSlider.value();
  normVol = vol * volSense;
}

function mousePressed() {
  audioOn = true;
  getAudioContext().resume();
}

function draw() {
  background(0, 0, 0, 10);
  circles1.displayPack();
  circles1.movePack(1);
  circles2.displayPack();
  circles2.movePack(1);
  if (audioOn) {

    vol = mic.getLevel();
    spectrum = fft.analyze();
    waveform = fft.waveform();

    waveForm();
    spectrumF();
    drawSkeleton();

  }

}

function drawSkeleton() {

  fft.analyze();
    console.log('audio on');
    let bassEnergy = fft.getEnergy('bass');
    let weight = map(bassEnergy, 0, 255, 1, 30); // Adjust the range as needed
    let dotSize = map(bassEnergy, 0, 255, 1, 30); // Adjust the range as needed

    // Draw the skeleton connections
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i];
      for (let j = 0; j < connections.length; j++) {
        let pointAIndex = connections[j][0];
        let pointBIndex = connections[j][1];
        let pointA = pose.keypoints[pointAIndex];
        let pointB = pose.keypoints[pointBIndex];
        // Only draw a line if both points are confident enough
        if (pointA.confidence > 0.1 && pointB.confidence > 0.1) {
          console.log(weight, bassEnergy);
          stroke(0, 0, 255);
          strokeWeight(weight);
          line(pointA.x, pointA.y, pointB.x, pointB.y);
        }
      }
    }

    // Draw all the tracked landmark points
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i];
      for (let j = 0; j < pose.keypoints.length; j++) {
        let keypoint = pose.keypoints[j];
        // Only draw a circle if the keypoint's confidence is bigger than 0.1
        if (keypoint.confidence > 0.1) {
          console.log(dotSize);
          fill(255, 0, 0);
          noStroke();
          circle(keypoint.x, keypoint.y, dotSize);
        }
      }
    }
  } 


// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}

function waveForm() {
  if (audioOn) {
    noFill();
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, 0, height);
      let strokeCol = map(waveform[i], -1, 1, 0, 360);
      let strokeSat = map(waveform[i], -1, 1, 0, 100);

      stroke(strokeCol, strokeSat, 100);
      strokeWeight(globescale * 0.01);
      vertex(x, y);

    }
    endShape();
   }
 }

 function spectrumF() {

  if(audioOn){
    let rectX
    let rectY
    let rectW
    let rectH
      for(let i = 0; i < spectrum.length; i++){
        
          rectX = map(i, 0, spectrum.length, 0, width);
          rectY = height;
          rectW = globescale * 0.05;
          rectH = -map(spectrum[i], 0, 255, 0, height);
          noStroke();
          fill(spectrum[i], 100, 100, 0.1);
          rect(rectX, rectY, rectW, rectH);
}

          let rectX2 = width - rectX - rectW;
          rect(rectX2, rectY, rectW, rectH);
    }
}

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

let sensitivity = 0.5; // Sensitivity to volume changes
let sensitivitySlider; // Slider to adjust sensitivity

let circles1;
let circles2;

//controls 
let vol;
let normVol;
let volSense = 100;
let sliderStep = 10;
let volSenseSlider;
/*
  create an array of possible colors for the skeleton
  */

let colors = ["#FE86FF", "#FD2CFF", "#C203D3", "#5F0FFF", "#1904DA"];
let colorIndex = 0;
let nextColorIndex = 1;
let timer = 0;
let colorTransitionProgress = 0;

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose("MoveNet", {flipped: true});
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
  circles1 = new Pack(width / 2, height / 2, 8, 180, 0);
  circles2 = new Pack(width / 2, height / 2, 8, 180, 180);

  sensitivitySlider = createSlider(0, 1, sensitivity, 0.01);
  sensitivitySlider.id('sensitivitySlider'); // Assign an ID to the slider
}

function mousePressed() {
  audioOn = true;
  getAudioContext().resume();
}

function draw() {
  background(0, 0, 0, 10);
  strokeWeight(1);
  circles1.displayPack();
  circles1.movePack(1);
  circles2.displayPack();
  circles2.movePack(1);

  if (audioOn) {
    vol = mic.getLevel();
    spectrum = fft.analyze();
    waveform = fft.waveform();

    drawSkeleton();
  }

  timer += deltaTime; // Increment the timer based on the elapsed time
  changeColor(); // Call the changeColor function to update the color
}

function drawSkeleton() {
  fft.analyze();
  let bassEnergy = fft.getEnergy('bass');
  let weight = map(bassEnergy, 0, 255, 1, 50); // Adjust the range as needed
  let dotSize = map(bassEnergy, 0, 255, 1, 50); // Adjust the range as needed

  // Calculate the current color by interpolating between the current and next colors
  let currentColor = lerpColor(color(colors[colorIndex]), color(colors[nextColorIndex]), colorTransitionProgress);

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
        // Use the interpolated color
        stroke(currentColor);
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
        fill(currentColor);
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

function changeColor() {
  sensitivity = sensitivitySlider.value(); // Update sensitivity based on slider value
  let volumeThreshold = sensitivity * 0.1; // Adjust the threshold based on sensitivity

  if (mic.getLevel() >= volumeThreshold) { 
    colorIndex = nextColorIndex;
    nextColorIndex = (nextColorIndex + 1) % colors.length;
    timer = 0; // Reset the timer after changing the color
    colorTransitionProgress = 0; // Reset the transition progress
  }

  // Increment the transition progress
  colorTransitionProgress += deltaTime / 2000; // Adjust the transition speed as needed
  colorTransitionProgress = constrain(colorTransitionProgress, 0, 1); // Ensure the progress stays within [0, 1]
}
// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}

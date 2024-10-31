let video;
let glitch;
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

function preload() {
  // Load the bodyPose model
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(innerWidth, innerWidth / ratio);
  globescale = min(width, height);

  // Create the video and hide it
  video = createCapture(VIDEO);
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


  glitch = new Glitch();
  glitch.pixelate(1);
}

function mousePressed() {
  audioOn = true;
  getAudioContext().resume();
}

function draw() {
  background(0);
  if (audioOn) {
    console.log('audio on');
    let bassEnergy = fft.getEnergy('bass');
    let weight = map(bassEnergy, 0, 255, 5, 20); // Adjust the range as needed
    let dotSize = map(bassEnergy, 0, 255, 5, 20); // Adjust the range as needed

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
    letGlitch();
  } 
}

function letGlitch() {
  if (frameCount % 5 == 0) {
    if (!mouseIsPressed) {
      glitch.loadImage(video);
    }

    let bassEnergy = fft.getEnergy("bass");
    // maps glitch to bass energy
    glitch.limitBytes(map(bassEnergy, 0, 255, 0, 1));
    glitch.randomBytes(map(bassEnergy, 0, 255, 0, 100));
    glitch.buildImage();
  }

  let bassEnergy = fft.getEnergy("bass");
  let glitchSize = map(bassEnergy, 0, 255, 50, 200); // Adjust the range as needed

  // Draw the glitch effect at the positions of the hands
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    let leftHand = pose.keypoints.find(keypoint => keypoint.part === 'leftWrist');
    let rightHand = pose.keypoints.find(keypoint => keypoint.part === 'rightWrist');

    if (leftHand && leftHand.position && leftHand.confidence > 0.1) {
      image(glitch.image, leftHand.position.x, leftHand.position.y, glitchSize, glitchSize);
    }

    if (rightHand && rightHand.position && rightHand.confidence > 0.1) {
      image(glitch.image, rightHand.position.x, rightHand.position.y, glitchSize, glitchSize);
    }
  }
}


// Callback function for when bodyPose outputs data
function gotPoses(results) {
  // Save the output to the poses variable
  poses = results;
}
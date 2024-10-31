let ratio = 1.3333333; //4:3 aspect ratio
let globeScale;

let mic;
let vol;
let normVol;
let volSense = 100;
let sliderStep = 10;
let volSenseSlider;
let startAudio = false;

let fft;
let spectrum;
let waveform;

let circles1;
let circles2;

function setup() {

  createCanvas(window.innerWidth, window.innerHeight / ratio);
  background(0);
  angleMode(DEGREES);
  circles1 = new Pack(width/2, height/2, 8, 180, 0);
  circles2 = new Pack(width/2, height/2, 8, 180, 180);

  volSenseSlider = createSlider(0, 200, volSense, sliderStep);
}

function draw() {

  background(0, 0, 0, 10);
  circles1.displayPack();
  circles1.movePack(1);
  circles2.displayPack();
  circles2.movePack(1);

  



  if (startAudio) {

    vol = mic.getLevel();
    spectrum = fft.analyze();
    waveform = fft.waveform();

    volSense = volSenseSlider.value();
    normVol = vol * volSense;

    waveForm();
    spectrumF();

    console.log(spectrum);

  }
}

function mousePressed() {

    getAudioContext().resume();

  if (!startAudio) {
    mic = new p5.AudioIn();
    fft = new p5.FFT();
    fft.setInput(mic);

    mic.start();
    startAudio = true;
  }
}

function waveForm() {
  if (startAudio) {
    noFill();
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, 0, height);
      let strokeCol = map(waveform[i], -1, 1, 0, 360);
      let strokeSat = map(waveform[i], -1, 1, 0, 100);

      stroke(strokeCol, strokeSat, 100);
      strokeWeight(globeScale * 0.01);
      vertex(x, y);

    }
    endShape();
  }
}

function spectrumF() {

    if(startAudio){
        for(let i = 0; i < spectrum.length; i++){

            let rectX = map(i, 0, spectrum.length, 0, width);
            let rectY = height;
            let rectW = globeScale * 0.05;
            let rectH = -map(spectrum[i], 0, 255, 0, height);
            noStroke();
            fill(spectrum[i], 100, 100, 0.1);
            rect(rectX, rectY, rectW, rectH);

            let rectX2 = width - rectX - rectW;
            rect(rectX2, rectY, rectW, rectH);

        }
    }
  }

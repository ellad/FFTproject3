//uses glitch library
//ted davis 2020

//is there a way for this to fade in from the background?
//shape drawn on screen
let glitch, capture, w, h;
let mic;
let fft;
let audioOn = false;
let blurVal = 0;
let glitchRange;

let timer = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    w = width * 0.25;
    h = height * 0.25;
    capture = createCapture(VIDEO); // capture webcam
    capture.size(w, h);
    capture.hide();
    glitchRange = 0.5;
    // setting up audio
    getAudioContext().suspend();
    fft = new p5.FFT();
    mic = new p5.AudioIn();
    mic.start();
    fft.setInput(mic);

    background(0);
    imageMode(CENTER);
    timer = millis();

    glitch = new Glitch();
    glitch.pixelate(1);
}

function draw() {
    if (audioOn) {
        filter(BLUR, blurVal);
        fft.analyze();
        letGlitch();
    }
        
    incBlur();
}

function incBlur() {
    let inc = 1;
    if (timer - millis() > 1000) {
        blurVal += inc; 
        if(blurVal > 10 || blurVal < 0) {
            inc *= -1;
        }

    }
}

function letGlitch() {
    if (frameCount % 5 == 0) {
        if (!mouseIsPressed) {
            glitch.loadImage(capture);
        }

        let bassEnergy = fft.getEnergy("bass");
        // maps glitch to bass energy
        glitch.limitBytes(map(bassEnergy, 0, 255, 0, 1));
        glitch.randomBytes(map(bassEnergy, 0, 255, 0, 100));
        glitch.buildImage();
    }
    
    let bassEnergy = fft.getEnergy("bass");
    let glitchWidth = map(bassEnergy, 0, 255, windowWidth * glitchRange, windowWidth);
    let glitchHeight = map(bassEnergy, 0, 255, windowHeight * glitchRange, windowHeight);
    
    image(glitch.image, width / 2, height / 2, glitchWidth, glitchHeight);
}

function increaseGlitchRange() {
    inc = .1
    glitchRange += inc;
    if (glitchRange > 1 || glitchRange < 0) {
        inc *= -1;
    }
}


function mousePressed() {
    audioOn = true;
    getAudioContext().resume();
    console.log("Audio context resumed and microphone started");

    r = random(10, 20);
    x = mouseX;
    y = mouseY;
}
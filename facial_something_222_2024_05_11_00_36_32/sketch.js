let canvasWidth = 600, canvasHeight = 400;
let clmTracker, video, canvas;
let positions = [];

function setup() {
  // Set up video
  video = createCapture(VIDEO);
  video.size(canvasWidth, canvasHeight);
  video.position(0, 0);
  video.style('z-index', '1');

  // Set up canvas
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '2');

  // Initialize and start the tracker
  clmTracker = new clm.tracker();
  clmTracker.init(pModel);
  clmTracker.start(video.elt);
}

function draw() {
  clear(); // Clear the canvas

  positions = clmTracker.getCurrentPosition();

  if (clmTracker.getScore() > 0.6 && positions) {
    drawFacialFeatures();
  }

  if (mouseIsPressed) {
    drawTrackingPoints();
  }
}

function drawFacialFeatures() {
  const eyeSize = calculateEyeSize();
  const mouthWidth = eyeSize * 2;
  const mouthHeight = eyeSize * 0.5;

  // Draw eyes and mouth
  drawEye(positions[32][0], positions[32][1], eyeSize); // Left eye
  drawEye(positions[27][0], positions[27][1], eyeSize); // Right eye
  drawMouth(positions[60][0], positions[60][1], mouthWidth, mouthHeight); // Mouth
}

function drawEye(x, y, size) {
  fill(0);
  ellipse(x, y, size, size);
}

function drawMouth(x, y, width, height) {
  fill(255, 0, 0);
  ellipse(x, y, width, height);
}

function calculateEyeSize() {
  const faceWidth = dist(positions[1][0], positions[1][1], positions[13][0], positions[13][1]);
  return faceWidth / 10;
}

function drawTrackingPoints() {
  for (let i = 0; i < positions.length; i++) {
    fill(0, 255, 0);
    ellipse(positions[i][0], positions[i][1], 4, 4);
  }
}

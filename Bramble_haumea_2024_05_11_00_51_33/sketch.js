let numLights = 100;
let lightRadius = 100;
let centerX, centerY;
let lightPositions = [];
let song;

let shapePoints = []; 

function preload() {
  song = loadSound('song.mp3');
}

function setup() {
  createCanvas(500, 500);
  stroke(255);
  centerX = width / 2;
  centerY = height / 2;

  for (let i = 0; i < numLights; i++) {
    let angle = map(i, 0, numLights, 0, TWO_PI);
    let x = centerX + cos(angle) * lightRadius;
    let y = centerY + sin(angle) * lightRadius;
    lightPositions.push(createVector(x, y));
  }

  // Generate the shape's vertices
  for (let i = 0; i < TWO_PI; i += TWO_PI / 2000) {
    let x = centerX + cos(i) * (lightRadius - 20) + random(-5, 5);
    let y = centerY + sin(i) * (lightRadius - 20) + random(-5, 5);
    shapePoints.push(createVector(x, y));
  }

  song.play();
  song.setLoop(true);
}

function draw() {
  background(0);

  for (let i = 0; i < numLights; i++) {
    // Update light positions
    lightPositions[i].add(random(-2, 2), random(-2, 2));

    // Draw lights
    let lightColor = color(random(255), random(255), random(255));
    fill(lightColor);
    noStroke();
    ellipse(lightPositions[i].x, lightPositions[i].y, 20, 20);
  }

  // Draw the nifty shape
  fill(255, 50);
  stroke(255);
  beginShape();
  for (let point of shapePoints) {
    let noiseX = noise(frameCount * 0.01) * 10; // Apply noise to X position
    let noiseY = noise(frameCount * 0.01) * 10; // Apply noise to Y position
    vertex(point.x + noiseX, point.y + noiseY);
  }
  endShape(CLOSE);


  let amp = song.getLevel();
  let bgColor = color(0, amp * 255, amp * 255);
  background(bgColor);
}


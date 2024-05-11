let flock;
let heartRate = 60; // Initial heart rate
let mySound;

let heartRates = []; // Array to store heart rate data from CSV
let currentHeartRateIndex = 0;

function setup() {
  
  createCanvas(1920 ,1080);
 
  

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 200; i++) {
    let b = new Boid(width / 2, height / 2);
    flock.addBoid(b);
  }
}

function preload() {
  loadStrings('HR.csv', processCSV);
  mySound = loadSound('song.mp3');
}

function processCSV(data) {
  // Skip the first line (timestamp)
  for (let i = 1; i < data.length; i++) {
    let hr = parseFloat(data[i].trim());
    if (!isNaN(hr)) {
      heartRates.push(hr);
    }
  }
  console.log("Loaded heart rates:", heartRates);
}


function draw() {
  
  let c1 = color(50, 50, 50); // Dark grey
  let c2 = color(10, 10, 10); // Almost black

  // Gradient background
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
  if (frameCount % 60 == 0) {
    if (currentHeartRateIndex < heartRates.length) {
      heartRate = heartRates[currentHeartRateIndex];
      currentHeartRateIndex++;
    }
  }
  
  let volume = map(heartRate, 60, 200, 0, 1);
  mySound.setVolume(volume);

  // Play the sound if it's not already playing
  if (!mySound.isPlaying()) {
    mySound.play();}
    
    let amplifiedHeartRate = heartRate * 5;
  
  fill(255);
  noStroke();
  textSize(24);
  text("Heart Rate: " + heartRate, 10, 30);

  // Adjust flock size based on heart rate
  let desiredFlockSize = map(heartRate, 60, 200, 100, 200);
  while (flock.boids.length < desiredFlockSize) {
    flock.addBoid(new Boid(random(width), random(height)));
  }

  // Update and run the flock
  flock.run();

}

// Flock class
function Flock() {
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let boid of this.boids) {
    boid.run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// Boid class
function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 6.0; // Base size
  this.maxspeed = 6;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.color = color(127); // Initial color
}

Boid.prototype.run = function(boids) {
  this.updatePropertiesBasedOnHeartRate();
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.updatePropertiesBasedOnHeartRate = function() {
  // Map heart rate to max speed and size
  this.maxspeed = map(heartRate, 60, 200, 3, 6);
  this.r = map(heartRate, 60, 200, 3, 6);

  // Map heart rate to color
  let colorHue = map(heartRate, 60, 200, 0, 360); // Map heart rate to a wider hue range
colorHue = (colorHue + millis() * 0.1) % 360; // Add time-based variation for more evident change
let colorSaturation = 100; // You can adjust saturation as needed
let colorBrightness = 100; // You can adjust brightness as needed

this.color = color(colorHue, colorSaturation, colorBrightness);


};

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Use the color based on heart rate
  fill(this.color);
  stroke(200);
  push();
  translate(this.position.x, this.position.y);
  rotate(this.velocity.heading() + radians(90));
  beginShape();
  vertex(0, -this.r * 4);
  vertex(-this.r*2, this.r * 4);
  vertex(this.r*2, this.r * 4);
  endShape(CLOSE);
  pop();
};


// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}
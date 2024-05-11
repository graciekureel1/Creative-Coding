let dots;
const canvasWidth = 400;
const canvasHeight = 400;
const numDots = 12;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(0); // Set the background to black

  dots = Array.from({ length: numDots }, (el, idx) => {
    angleMode(DEGREES);
    const theta = idx * 360 / numDots;
    const x = canvasWidth / 2 + sin(theta) * canvasWidth / 3;
    const y = canvasHeight / 2 + cos(theta) * canvasWidth / 3;
    const sz = random(10, 30); // Vary the size of the dots

    return {
      x,
      y,
      sz,
      baseCol: [random(255), random(255), random(255)],
      clickCol: [random(255), random(255), random(255)],
      clicked: false,
    };
  });
}

function mousePressed() {
  dots.forEach(d => {
    if (dist(mouseX, mouseY, d.x, d.y) < d.sz / 2) {
      d.clicked = true;
    }
  });
}

function mouseReleased() {
  dots.forEach(d => {
    d.clicked = false;
  });
}

function mouseDragged() {
  dots.forEach(d => {
    if (d.clicked) {
      d.x = mouseX;
      d.y = mouseY;
    }
  });
}

function draw() {
  noFill();
  stroke(255, 50); // Add some transparency to the lines
  strokeWeight(1);

  // Connect dots with lines
  for (let i = 0; i < dots.length - 1; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      line(dots[i].x, dots[i].y, dots[j].x, dots[j].y);
    }
  }

  dots.forEach(d => {
    noStroke();
    if (d.clicked) {
      fill(d.clickCol);
    } else {
      fill(d.baseCol);
    }
    ellipse(d.x, d.y, d.sz);
  });
}

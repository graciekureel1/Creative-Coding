let video;
let listOfColors = ["#FF5733", "#FFC300", "#33FF57", "#337DFF", "#C933FF", "#FF33B5", "#FF337D", "#33C1FF", "#33FFAA", "#FF33AA"];
let targetColor;
let maxScore = 100; 
let score = 0;
let isPlaying = false;
let startTime;
let maxTime = 30; 
let isChoosingColor = false;
let level = 1;

let grid;
let gridSlider = 30;

function setup() {
  createCanvas(1050, 750);
  frameRate(60);

  slider = createSlider(10, 60, 30, 1);
  slider.position(10, 10);
  slider.style('width', '150px');

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  grid = new SquareGrid();

  startButton = createButton('Start');
  startButton.position(10, height - 40);
  startButton.mousePressed(startGame);

  endButton = createButton('End');
  endButton.position(70, height - 40);
  endButton.mousePressed(endGame);
}

function draw() {
  if (isPlaying) {
    background(0, 50);
    grid.display();

    textSize(24);
    fill(255);
    text(`Score: ${score}`, width - 200, 40);
    text(`Level: ${level}`, width - 200, 70);
    fill(targetColor);
    rect(width - 150, 100, 50, 50); // Showing target color as a square

    if (isChoosingColor) {
      textSize(24);
      fill(255);
      text('Find the color: ', width - 280, 130);
    }

    if (score >= maxScore) {
      endGame();
      textSize(48);
      text('You Win!', width / 2 - 80, height / 2);
    } else {
      const timeLeft = maxTime - int((millis() - startTime) / 1000);
      if (timeLeft <= 0) {
        endGame();
        textSize(48);
        text('You Lose!', width / 2 - 80, height / 2);
      } else {
        textSize(24);
        fill(255);
        text(`Time Left: ${timeLeft}`, width - 200, 100);
      }
    }
  }
}

function startGame() {
  isPlaying = true;
  score = 0;
  startTime = millis();
  loop();
  chooseTargetColor();
  isChoosingColor = true;
}

function endGame() {
  isPlaying = false;
  background(0);
  noLoop();
}

function chooseTargetColor() {
  targetColor = random(listOfColors);
}

class SquareClass {
  constructor(px, py, s, color) {
    this.positionX = px;
    this.positionY = py;
    this.size = s;
    this.c = color;
  }

  display() {
    rectMode(CENTER);
    fill(this.c);
    rect(this.positionX, this.positionY, this.size, this.size);
  }

  isMaxSize() {
    return this.size >= gridSlider;
}

  isMouseOver(x, y) {
    return x > this.positionX - this.size / 2 && x < this.positionX + this.size / 2 &&
           y > this.positionY - this.size / 2 && y < this.positionY + this.size / 2;
    
  }
  
  isInside(x, y) {
  return (x > this.positionX - this.size / 2) && 
         (x < this.positionX + this.size / 2) &&
         (y > this.positionY - this.size / 2) && 
         (y < this.positionY + this.size / 2);
}
}

class SquareGrid {
  constructor() {
    this.gridSize = 30;
    this.squares = [];

    for (let y = 0; y < video.height; y += this.gridSize) {
      let row = [];
      for (let x = 0; x < video.width; x += this.gridSize) {
        let index = (y * video.width + x) * 4;
        let r = video.pixels[index];
        let color = random(listOfColors);
        let side = map(r, 0, 255, this.gridSize, 2);
        row.push(new SquareClass(x + this.gridSize / 2, y + this.gridSize / 2, side, color));
      }
      this.squares.push(row);
    }
  }

  display() {
    video.loadPixels();
    gridSlider = slider.value();

    for (let i = 0; i < this.squares.length; i++) {
      for (let j = 0; j < this.squares[0].length; j++) {
        let index = (i * this.gridSize * video.width + j * this.gridSize) * 4;
        let side = map(video.pixels[index], 0, 255, gridSlider, 0);
        this.squares[i][j].size = side;
        this.squares[i][j].display();
      }
    }
  }
}

function mousePressed() {
    if (isPlaying && isChoosingColor) {
        for (let i = 0; i < grid.squares.length; i++) {
            for (let j = 0; j < grid.squares[i].length; j++) {
                let square = grid.squares[i][j];
                
                if (square.isInside(mouseX, mouseY)) {
                    if (square.c === targetColor) {
                        score += 10;  // increase the score for correct color
                        chooseTargetColor();
                    } else {
                        score -= 5;  // decrease the score for wrong color
                    }
                }
            }
        }
    }
}









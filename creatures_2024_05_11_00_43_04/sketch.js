let creatures = [];
let numCreatures = 30; 

function setup() {
    createCanvas(700, 700);
    noStroke();

    // Generate creatures
    for (let i = 0; i < numCreatures; i++) {
        creatures.push(new Creature(random(width), random(height)));
    }
}

function draw() {
    gradientBackground();

    
    fill(20, 20, 40, 50);
    rect(0, 0, width, height);

    for (let c of creatures) {
        c.update();
        c.render();
    }

    
    creatures = creatures.filter(c => c.isAlive());
}

function gradientBackground() {
    let topColor = color(20, 20, 40);
    let bottomColor = color(40, 20, 35);

    for (let y = 0; y < height; y++) {
        let inter = map(y, 0, height, 0, 1);
        let c = lerpColor(topColor, bottomColor, inter);
        stroke(c);
        line(0, y, width, y);
    }
}

class Creature {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-0.2, 0.2), random(-0.2, 0.2)); 
        this.size = random(20, 50); 
        this.color = color(random(220, 255), random(220, 255), random(220, 255), 130);
        this.lifespan = random(200, 600);
        this.eyeSize = this.size / 2.5;
        this.pupilSize = this.eyeSize / 2.5;
        this.pupilPos = createVector(0, 0); 
    }

    update() {
        this.pos.add(this.vel);
        this.lifespan -= 0.5; 
        
        this.pupilPos.x = random(-this.eyeSize / 8, this.eyeSize / 8); 
        this.pupilPos.y = random(-this.eyeSize / 8, this.eyeSize / 8);

        // Wrap around the canvas
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;
        if (this.pos.y > height) this.pos.y = 0;
        if (this.pos.y < 0) this.pos.y = height;
    }

    render() {
        if (this.lifespan <= 0) return; 

        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.size);

        
        fill(255);
        ellipse(this.pos.x - this.size / 4, this.pos.y, this.eyeSize);
        ellipse(this.pos.x + this.size / 4, this.pos.y, this.eyeSize);

        
        fill(0);
        ellipse(this.pos.x - this.size / 4 + this.pupilPos.x, this.pos.y + this.pupilPos.y, this.pupilSize);
        ellipse(this.pos.x + this.size / 4 + this.pupilPos.x, this.pos.y + this.pupilPos.y, this.pupilSize);
    }

    isAlive() {
        return this.lifespan > 0;
    }
}




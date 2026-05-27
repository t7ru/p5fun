// =============================================
// sketch2.js — your second source sketch
// Paste your source sketch code here and start hacking
// =============================================

let p = [];

function setup() {
  createCanvas(800, 500);
  colorMode(HSB, 255);
  noStroke();
}

function draw() {
  background(0, 20);
  blendMode(ADD);
  if (mouseIsPressed) {
    for (let i = 0; i < 4; i += 1) p.push(new P(mouseX, mouseY));
  }
  if (frameCount % 2 === 0) p.push(new P(width / 2, height - 12));
  let w = map(mouseX, 0, width, -0.05, 0.05);
  let g = map(mouseY, 0, height, 0.02, -0.02);
  for (let i = p.length - 1; i >= 0; i -= 1) {
    let q = p[i];
    q.v.x += w;
    q.v.y += g;
    q.update();
    q.show();
    if (q.dead()) p.splice(i, 1);
  }
  blendMode(BLEND);
}

class P {
  constructor(x, y) {
    this.p = createVector(x, y);
    this.v = createVector(random(-0.4, 0.4), random(-1.8, -0.4));
    this.l = 255;
    this.h = random(160, 220);
    this.s = random(6, 14);
  }

  update() {
    this.p.add(this.v);
    this.v.mult(0.99);
    this.l -= 2.5;
  }

  show() {
    fill(this.h, 200, 255, this.l);
    circle(this.p.x, this.p.y, this.s * (1 - this.l / 255) + 4);
  }

  dead() {
    return this.l <= 0 || this.p.y < -20 || this.p.x < -20 || this.p.x > width + 20;
  }
}

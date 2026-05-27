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
		for (let i = 0; i < 5; i += 1) p.push(new P(mouseX, mouseY));
	}

	if (frameCount % 2 === 0) {
		p.push(new P(width / 2 + random(-20, 20), height - 12));
	}

	let w = map(mouseX, 0, width, -0.08, 0.08);
	let g = map(mouseY, 0, height, 0.02, -0.02) - 0.01;

	let holeX = width / 2;
	let holeY = height / 2 - 50;

	for (let i = p.length - 1; i >= 0; i -= 1) {
		let q = p[i];

		let dx = holeX - q.p.x;
		let dy = holeY - q.p.y;
		let dSq = dx * dx + dy * dy + 100;
		let force = 15 / dSq;

		q.v.x += w + dx * force - dy * force * 0.5;
		q.v.y += g + dy * force + dx * force * 0.5;

		q.v.x +=
			(noise(q.p.x * 0.01, q.p.y * 0.01, frameCount * 0.01) - 0.5) *
			0.777;

		q.update();
		q.show();
		if (q.dead()) p.splice(i, 1);
	}

	blendMode(BLEND);

	fill((frameCount * 0.5) % 255, 255, 255, 40);
	ellipse(holeX, holeY, 15 + sin(frameCount * 0.1) * 3);
	fill(0);
	ellipse(holeX, holeY, 6);
}

class P {
	constructor(x, y) {
		this.p = createVector(x, y);
		this.v = createVector(random(-0.4, 0.4), random(-1.8, -0.4));
		this.l = 255;
		this.h = (frameCount * 2 + random(60)) % 255;
		this.s = random(8, 18);
	}

	update() {
		this.p.add(this.v);
		this.v.mult(0.985);
		this.l -= 2;
	}

	show() {
		fill(this.h, 200, 255, this.l);
		circle(this.p.x, this.p.y, this.s * (1 - this.l / 255) + 5);
	}

	dead() {
		return (
			this.l <= 0 ||
			this.p.y < -40 ||
			this.p.x < -40 ||
			this.p.x > width + 40
		);
	}
}

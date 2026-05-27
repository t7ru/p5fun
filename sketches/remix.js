// =============================================
// remix.js — your combined sketch
// This is where sketch1 and sketch2 come together
// into something new
// =============================================

let g,
	p = [],
	cx = -0.5,
	cy = 0,
	z = 1;

function setup() {
	let c = createCanvas(800, 500);
	c.parent("sketch-container");
	pixelDensity(1);
	noSmooth();
	colorMode(HSB, 255);
	g = createGraphics(220, 140);
	g.pixelDensity(1);
	g.noSmooth();
}

function draw() {
	cx +=
		(map(mouseX, 0, width, -2.1, 0.7) +
			sin(frameCount * 0.01) * 0.08 -
			cx) *
		0.03;
	cy +=
		(map(mouseY, 0, height, -1.2, 1.2) +
			cos(frameCount * 0.013) * 0.05 -
			cy) *
		0.03;
	z += (1 + p.length * 0.01 - z) * 0.03;
	// the well keeps the smoke in orbit
	let wx = width / 2,
		wy = height / 2 - 50;

	let w = 3 / z;
	let h = 2 / z;
	let sx = cx - w / 2;
	let sy = cy - h / 2;
	let m = 34;

	g.loadPixels();
	for (let y = 0; y < g.height; y++) {
		for (let x = 0; x < g.width; x++) {
			let a = sx + (x * w) / g.width;
			let b = sy + (y * h) / g.height;
			let ca = a;
			let cb = b;
			let i = 0;
			while (i < m && a * a + b * b < 16) {
				let aa = a * a - b * b + ca;
				b = 2 * a * b + cb;
				a = aa;
				i += 1;
			}
			let k = (x + y * g.width) * 4;
			let t = i < m ? pow(i / m, 0.7) : 0;
			let n = 0.9 + 0.1 * sin((x + y + frameCount) * 0.03);
			g.pixels[k] = i < m ? (10 + 245 * t) * n : 0;
			g.pixels[k + 1] = i < m ? (35 + 170 * (1 - t)) * n : 0;
			g.pixels[k + 2] = i < m ? (120 + 135 * (1 - t)) * n : 0;
			g.pixels[k + 3] = 255;
		}
	}
	g.updatePixels();
	image(g, 0, 0, width, height);

	if (mouseIsPressed) {
		for (let i = 0; i < 5; i += 1)
			p.push(new P(mouseX + random(-8, 8), mouseY + random(-8, 8)));
	}
	if (frameCount % 2 === 0)
		p.push(new P(width / 2 + random(-20, 20), height - 12));
	if (p.length > 220) p.splice(0, p.length - 220);

	blendMode(ADD);
	for (let i = p.length - 1; i >= 0; i -= 1) {
		let q = p[i];
		let dx = wx - q.p.x,
			dy = wy - q.p.y,
			f = 15 / (dx * dx + dy * dy + 100);
		q.v.x += dx * f - dy * f * 0.5;
		q.v.y += dy * f + dx * f * 0.5;
		q.step();
		q.show();
		if (q.dead()) p.splice(i, 1);
	}
	blendMode(BLEND);
	fill((frameCount * 0.5) % 255, 255, 255, 40);
	ellipse(wx, wy, 15 + sin(frameCount * 0.1) * 3);
	fill(0);
	ellipse(wx, wy, 6);

	push();
	translate(width - 110, 20);
	fill(0, 150);
	stroke(255, 50);
	strokeWeight(1);
	rect(0, 0, 90, 60, 4);
	let rx = map(cx, -2.1, 0.7, 0, 90),
		ry = map(cy, -1.2, 1.2, 0, 60),
		rw = map(3 / z, 0, 2.8, 0, 90),
		rh = map(2 / z, 0, 2.4, 0, 60);
	noFill();
	stroke(255, 0, 100);
	rect(rx - rw / 2, ry - rh / 2, rw, rh);
	line(rx - 4, ry, rx + 4, ry);
	line(rx, ry - 4, rx, ry + 4);
	fill(200);
	noStroke();
	textSize(9);
	text("Z: " + z.toFixed(1) + "x", 5, 55);
	pop();
}

function sample(x, y) {
	let i =
		(constrain(floor((x / width) * g.width), 0, g.width - 1) +
			constrain(floor((y / height) * g.height), 0, g.height - 1) *
				g.width) *
		4;
	return (g.pixels[i] + g.pixels[i + 1] + g.pixels[i + 2]) / 765;
}

class P {
	constructor(x, y) {
		this.p = createVector(x, y);
		this.v = createVector(random(-0.4, 0.4), random(-1.8, -0.4));
		this.l = 255;
		this.h = (frameCount * 2 + random(60)) % 255;
		this.s = random(8, 18);
	}

	step() {
		let n = sample(this.p.x, this.p.y);
		this.v.x += (n - 0.5) * 0.08;
		this.v.y += (0.35 - n) * 0.04;
		this.p.add(this.v);
		this.v.mult(0.985);
		this.l -= 2;
	}

	show() {
		fill(
			(this.h + sample(this.p.x, this.p.y) * 120) % 255,
			200,
			255,
			this.l,
		);
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

function keyPressed() {
	if (key === "r" || key === "R") {
		p = [];
		cx = -0.5;
		cy = 0;
		z = 1;
	}
}

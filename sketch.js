// @ts-nocheck
// the setup & draw functions are 'reserved functions' in p5js, meaning p5js uses it internally. notice there are no function calls in this script, yet the code runs in the page! (p5 calls these automatically)
function setup() {
	createCanvas(1024, 768);
	noFill();
}

function draw() {
	background(10, 15, 30, 77);
	blendMode(ADD);
	translate(width / 2, height / 2);

	let numCurves = parseInt(document.getElementById("curves").value);
	let speed = parseFloat(document.getElementById("speed").value);
	let scale = parseFloat(document.getElementById("scale").value);
	let weight = parseFloat(document.getElementById("weight").value);
	let rot = radians(parseFloat(document.getElementById("rotate").value));

	for (let i = 0; i < numCurves; i++) {
		push();
		rotate(
			(TWO_PI / numCurves) * i + rot + sin(frameCount * speed * 0.5) * 0.15,
		);

		let col1 = color(100, 200 + sin(frameCount * speed + i) * 100, 255);
		let col2 = color(255, 100 + cos(frameCount * speed + i) * 100, 150);
		let idkColor = lerpColor(col1, col2, i / numCurves);

		stroke(idkColor);
		strokeWeight(weight);

		let offset = noise(frameCount * speed * 0.5, i) * scale;
		bezier(
			0,
			0,
			scale * 1 + offset,
			scale * 0.5,
			scale * 2 - offset,
			scale * 1.5,
			scale * 1.5 + noise(frameCount * speed * 0.75, i * 2) * scale,
			scale * 2.5,
		);

		pop();
	}

	noStroke();
	let pulseSpeed = parseFloat(document.getElementById("pulseSpeed").value);
	let pulseMax = parseFloat(document.getElementById("pulseMax").value);

	for (let r = 20; r < pulseMax; r += 30) {
		let alpha = map(sin(frameCount * pulseSpeed - r * 0.02), -1, 1, 50, 200);
		fill(100, 150, 255, alpha);
		circle(
			sin(frameCount * pulseSpeed + r * 0.05) * 25,
			cos(frameCount * pulseSpeed + r * 0.05) * 25,
			r,
		);
	}

	let mode = {
		BLEND,
		SCREEN,
		DIFFERENCE,
	}[document.getElementById("blend").value];

	blendMode(mode);
}

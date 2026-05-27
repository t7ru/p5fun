// =============================================
// sketch1.js — your first source sketch
// Paste your source sketch code here and start hacking
// =============================================

let g, cx = -0.5, cy = 0, z = 1;

function setup() {
  createCanvas(800, 500);
  pixelDensity(1);
  noSmooth();
  g = createGraphics(200, 125);
  g.pixelDensity(1);
}

function draw() {
  cx += (map(mouseX, 0, width, -1.8, 0.4) + sin(frameCount * 0.01) * 0.08 - cx) * 0.04;
  cy += (map(mouseY, 0, height, -1, 1) + cos(frameCount * 0.013) * 0.05 - cy) * 0.04;
  z += ((mouseIsPressed ? 2.1 : 1.05) - z) * 0.04;

  let w = 3 / z;
  let h = 2 / z;
  let sx = cx - w / 2;
  let sy = cy - h / 2;
  let m = 30;

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
      let t = i < m ? sqrt(i / m) : 0;
      g.pixels[k] = i < m ? 10 + 245 * t : 0;
      g.pixels[k + 1] = i < m ? 35 + 170 * (1 - t) : 0;
      g.pixels[k + 2] = i < m ? 120 + 135 * (1 - t) : 0;
      g.pixels[k + 3] = 255;
    }
  }
  g.updatePixels();
  image(g, 0, 0, width, height);
}

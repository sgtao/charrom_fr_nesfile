// charrom.js
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
const fch = require('fetch');

// check arguments
let nesPath = 'samples/hello.nes';
let distPath = 'charrom.png';
for (let i in process.argv) {
  console.log(`${i} : ${process.argv[i]}`);
  if (i == 2) { nesPath  = process.argv[i]; }
  if (i == 3) { distPath = process.argv[i]; }
}
console.log(`input : ${nesPath}, output : ${distPath}`);

// read nesfile
let nes;
try {
  nes = fs.readFileSync(nesPath);
} catch (error) {
  throw new Error(error);
}
if ([].slice.call(nes, 0, 3).map(v => String.fromCharCode(v)).join('') !== 'NES') {
  throw new Error(`${nesPath} is not an NES file.`);
}

// pullout charactor ROM to png file by reference bokuweb code
const NES_HEADER_SIZE = 0x0010;
const PROGRAM_ROM_SIZE = 0x4000;
const CHARACTOR_ROM_SIZE = 0x2000;
const DEFAULT_CANVAS_WIDTH = 800;
const pixelSize = 2;

const programROMPages = nes[4];
const characterROMPages = nes[5];
const spritesPerRow = DEFAULT_CANVAS_WIDTH / (8 * pixelSize);
const spritesNum = CHARACTOR_ROM_SIZE * characterROMPages / 16;
const rowNum = ~~(spritesNum / spritesPerRow) + 1;

const height = rowNum * 8 * pixelSize;
const canvas = createCanvas(DEFAULT_CANVAS_WIDTH, height);
const ctx = canvas.getContext('2d');

ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, DEFAULT_CANVAS_WIDTH, height);

const charactorROMsart = NES_HEADER_SIZE + programROMPages * PROGRAM_ROM_SIZE;
const renderSprite = (spriteNum) => {
  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i > 7 ? "rgb(255, 255, 255)" : "rgb(128, 128, 128)";
    for (let j = 0; j < 8; j++) {
      if (nes[charactorROMsart + spriteNum * 16 + i] & (0x80 >> j)) {
        const x = (j + (spriteNum % spritesPerRow) * 8) * pixelSize;
        const y = ((i % 8) + ~~(spriteNum / spritesPerRow) * 8) * pixelSize;
        ctx.fillRect(x, y, pixelSize, pixelSize);
      }
    }
  }
};

for (let i = 0; i < spritesNum; i++) {
  renderSprite(i);
}

const data = canvas.toDataURL().split(',')[1];
const buffer = new Buffer(data, 'base64');
fs.writeFileSync(distPath, buffer);

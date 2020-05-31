// charrom.js
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
const fch = require('fetch');

// check arguments
let nesPath = 'samples/hello.nes';
let distPath = '--';
for (let i in process.argv) {
  // console.log(`${i} : ${process.argv[i]}`);
  if (i == 2) { nesPath  = process.argv[i]; }
  if (i == 3) { distPath = process.argv[i]; }
}
console.log(`input : ${nesPath}, output : ${distPath}`);

// read nesfile
let nesrom ;
try {
  nesrom = fs.readFileSync(nesPath);
} catch (error) {
  throw new Error(error);
}

const toHEX = (num) => {
  return num < 16 ? '0' + num.toString(16).toUpperCase() : 
                    num.toString(16).toUpperCase(); 
}
const strHEXarray = (buf) => {
  let hex_str = '';
  for (let i in buf) { hex_str += toHEX(buf[i]) + ' '; }
  return hex_str;
}
// let header_record = Array.prototype.slice.call(nesrom, 0, 3);
let hdr_record = [].slice.call(nesrom, 0, 15);
let hdr_record_str = hdr_record.slice(0,3).map(v => String.fromCharCode(v)).join('');
const programROMPages = hdr_record[4];
const characterROMPages = hdr_record[5];
const NES_HEADER_SIZE = 0x0010;
const PROGRAM_ROM_SIZE = 0x4000;   // unit size is 16KB
const CHARACTOR_ROM_SIZE = 0x2000; // unit size is 8KB

const programROMstart  = NES_HEADER_SIZE;
const charactorROMsart = programROMstart + programROMPages * PROGRAM_ROM_SIZE;
const charactorROMend = charactorROMsart + characterROMPages * CHARACTOR_ROM_SIZE - 1;

console.log('HDR(ADR[0:F]) : ' + strHEXarray(hdr_record));
console.log(`HDR record    :  ${hdr_record_str}`);
if (hdr_record_str !== 'NES') {
  throw new Error(`${nesPath} is not an NES file.`);
}
console.log('progROM addr. : 0x', toHEX(programROMstart), ' - 0x', toHEX(charactorROMsart - 1));
console.log('charROM addr. : 0x', toHEX(charactorROMsart), ' - 0x', toHEX(charactorROMend - 1));


// pullout charactor ROM to png file by reference bokuweb code
const DEFAULT_CANVAS_WIDTH = 800;
const pixelSize = 2;
const spritesPerRow = DEFAULT_CANVAS_WIDTH / (8 * pixelSize);
const spritesNum = CHARACTOR_ROM_SIZE * characterROMPages / 16;
const rowNum = ~~(spritesNum / spritesPerRow) + 1;
const height = rowNum * 8 * pixelSize;

const canvas = createCanvas(DEFAULT_CANVAS_WIDTH, height);
const ctx = canvas.getContext('2d');
ctx.fillStyle = "rgb(0, 0, 0)";
ctx.fillRect(0, 0, DEFAULT_CANVAS_WIDTH, height);

const renderSprite = (spriteNum) => {
  let sprite_addr   = charactorROMsart + spriteNum * 16 ;
  let sprite_record = [].slice.call(nesrom, sprite_addr, sprite_addr + 15);
  // console.log('sprite ', spriteNum, ' : addr = 0x' + toHEX(sprite_addr));
  // console.log('  ' + strHEXarray(sprite_record));
  // display ascii art.
  /*
  for (let i = 0; i < 8; i++) {
    let column ='  ';
    for (let j = 0; j < 8; j++) {
      let bit_hi = (nesrom[sprite_addr + 8 + i] & (0x80 >> j)) >> (7-j);
      let bit_lo = (nesrom[sprite_addr     + i] & (0x80 >> j)) >> (7-j);
      switch ((bit_hi << 1) + bit_lo) {
        case 0:
          column += '  ';
          break;;
        case 1:
          column += ' .';
          break;;
        case 2:
          column += ' #';
          break;;
        case 3:
          column += '##';
          break;;
        default:
          column += '  ';
          break;;
      }
    }
    console.log(column);
  }
  */

  for (let i = 0; i < 16; i++) {
    ctx.fillStyle = i > 7 ? "rgb(255, 255, 255)" : "rgb(128, 128, 128)";
    for (let j = 0; j < 8; j++) {
      if (nesrom[sprite_addr + i] & (0x80 >> j)) {
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
if (distPath !== '--') 
  fs.writeFileSync(distPath, buffer);
else
  console.log('file output is skipped.');

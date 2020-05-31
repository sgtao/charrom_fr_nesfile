// charrom.js
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')

// check arguments
// console.log(process);
for (let i in process.argv) {
  console.log(`${i} : ${process.argv[i]}`);
}


// charrom.js
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

// check arguments
// console.log(process);
for (let i in process.argv) {
  console.log(`${i} : ${process.argv[i]}`);
}

// create canvas
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')
var distPath = 'charrom.png';

// Write "Awesome!"
ctx.font = '30px Impact'
ctx.rotate(0.1)
ctx.fillText('Awesome!', 50, 100)

// Draw line under text
var text = ctx.measureText('Awesome!')
ctx.strokeStyle = 'rgba(0,0,0,0.5)'
ctx.beginPath()
ctx.lineTo(50, 102)
ctx.lineTo(50 + text.width, 102)
ctx.stroke()

// output png file of cat with lime helmet
loadImage('./lime-cat.jpg').then((image) => {
  ctx.drawImage(image, 50, 0, 70, 70)

  const data = canvas.toDataURL().split(',')[1];
  const buffer = new Buffer(data, 'base64');
  fs.writeFileSync(distPath, buffer);
})


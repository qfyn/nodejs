const { readFile, writeFile, mkdir } = require("fs/promises");
const fs = require("fs");

console.log('fs', fs.writeFile('./fs.txt', 'fs', (err, data) => {
  console.log('fserr', err);
}));
console.log('promises', writeFile('./promises.txt', 'promises'));
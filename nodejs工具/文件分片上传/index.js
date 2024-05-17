const fs = require('fs');

const root = 'D:/Users/Desktop/ceshi.txt'

const total = fs.statSync(root).size
console.log('total', total);
// if (total > 0) {
//   fs.open(root, (err, fd) => {
//     const limit = 1000
//     for(let i = 0; i < total + limit; i += limit) {
//       fs.readSync(fd, Buffer.alloc(i + limit),{
//         offset: 0,
//         length: limit,
//         position: i
//       })
//       const progress = Math.floor((i / total) * 100 )
//       console.log(progress > 100 ? '100%' : progress+ '%');
//     }
//   })
// }

fs.createReadStream(root, {
  start: 10,
  end: 20
}).on('data', (chunk) => {
  console.log(chunk.toString());
  console.log(chunk.length);
})

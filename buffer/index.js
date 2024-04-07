const { Buffer, Blob  } = require('buffer');
const { MessageChannel } = require('worker_threads');

const str = '3124'
console.log(Buffer.byteLength(str));
console.log(str.length);


console.log('--------------------from----------------------------');
const buf = Buffer.from([1, 2, 3]);
for (const b of buf) {
  console.log(b);
}


// console.log('---------------------blob---------------------------');
// const blob = new Blob(['hello blob']);
// const mc1 = new MessageChannel();
// mc1.port1.onmessage = async ({ data }) => {
//   data.text().then(console.log);
//   console.log(await data.arrayBuffer());
//   mc1.port1.close();
// };
// mc1.port2.postMessage(blob);

console.log('---------------------alloc---------------------------');
const allocBuf = Buffer.alloc(5, 'a');
for (const b of allocBuf) {
  console.log(String.fromCharCode(b));
}


console.log('---------------------compare---------------------------');
const buf1 = Buffer.from('1234');
console.log('buf1', buf1);
const buf2 = Buffer.from('0123');
console.log('buf2', buf2);
const arr = [buf1, buf2];
console.log(arr.sort(Buffer.compare));
console.log(buf1.compare(buf2));
console.log(Buffer.compare(buf1, buf2) === buf1.compare(buf2));


console.log('---------------------concat---------------------------');
const allocBuf1 = Buffer.alloc(2, 'a');
const allocBuf2 = Buffer.alloc(3, 'b');
const concatBuf = Buffer.concat([allocBuf1, allocBuf2]);
for (const b of concatBuf) {
  console.log(String.fromCharCode(b));
}
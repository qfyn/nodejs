const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* processChunk (source, { signal }) {
      source.setEncoding('utf8');  // Work with strings rather than `Buffer`s.
      for await (const chunk of source) {
        if(chunk instanceof Object) {
          yield await processChunk(chunk, { signal });
        } else {
          yield chunk.toUpperCase();
        }
      }
    },
    fs.createWriteStream('uppercase.txt'),
    { signal }
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);

// // -------------------------------------------------------------------
// const { finished } = require('node:stream/promises');

// const rs = fs.createReadStream('lowercase.txt');

// async function runLowercase() {
//   await finished(rs);
//   console.log('Stream is done reading.');
// }

// runLowercase().catch(console.error);
// rs.resume(); // Drain the stream.



// // ===============================================================
// // Write the data to the supplied writable stream one million times.
// // Be attentive to back-pressure.
// const Writable = require('stream').Writable

function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // Last time!
        writer.write(data, encoding, callback);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // Had to stop early!
      // Write some more once it drains.
      writer.once('drain', write);
    }
  }
}
const writer = fs.createWriteStream('finished.txt')
writeOneMillionTimes(writer, 'hello, world\n', 'utf-8', () => {
  writer.end();
})


const file = fs.createWriteStream('example.txt');
file.cork();
file.write('some ');
file.write('data ');
process.nextTick(() => file.uncork()); 


const readable = fs.createReadStream('readtest.txt', {encoding: 'utf-8'});
readable.on('data', (chunk) => {
  // console.log(chunk.toString('utf-8'));
  // console.log(chunk);
  console.log(`Received ${chunk.length} bytes of data.`);
});
// readable.on('readable', () => {
//   console.log(`readable: ${readable.read()}`);
// });
readable.on('end', () => {
  console.log('There will be no more data.');
});


const readable1 = fs.createReadStream('readtest.txt', {encoding: 'utf-8'});
const writable = fs.createWriteStream('writableFile.txt');
readable1.pipe(writable); 
readable1.on('end', () => {
  console.log('writable end');
  readable.unpipe(writable);
  writer.end()
});


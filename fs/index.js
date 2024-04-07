const fs = require('fs');
const path = require('path');

var fileHandle
async function fileHandleFun(params) {
  try {
    fileHandle = await fs.promises.appendFile('file.txt', 'Hello, World!')
    await fs.promises.rm(__dirname + '/dist', { recursive: true })
    await fs.promises.mkdir(__dirname + '/dist', { recursive: true })
    fs.promises.copyFile('file.txt', './dist/file2.txt')
    const dir = await fs.promises.opendir('./dist')
    for await (const dirent of dir)
    console.log(dirent);
    const files = await fs.promises.readdir('./dist')
    for (const file of files) {
      console.log(file);
    }
    const contents = await fs.promises.readFile('./dist/file2.txt', { encoding: 'utf8' });
    console.log(contents);
    await fs.promises.rename('./dist/file2.txt', './dist/file3.txt')
    await fs.promises.truncate(__dirname + '/dist/file3.txt', 4)
    await fs.promises.writeFile(__dirname + '/dist/file3.txt', 'Hello,word!')

    fs.chmod(__dirname + '/message.txt', 0o777, (err) => {
      if (err) {
        console.error('error');
      } else {
        console.log('read');
      }
    })
    const controller = new AbortController();
    const { signal } = controller;
    const data = new Uint8Array(Buffer.from('Hello Node.js1'));
    const promise = fs.promises.writeFile('message.txt', data, { signal });
    // controller.abort();
    await promise;

    fs.access(__dirname + '/dist/file3.txt', fs.constants.R_OK, (err) => {
      if (err) {
        console.error('no access');
      } else {
        console.log('can access');
      }
    })
    fs.createWriteStream(__dirname + '/message.txt', { flags: 'a', fd: await fs.promises.appendFile('message.txt', '---Hello, World!') });
    const stream = fs.createReadStream(__dirname + '/message.txt', { start: 0, end: 10 }); 
    setTimeout(() => {
      stream.close(); // This may not close the stream.
      // Artificially marking end-of-stream, as if the underlying resource had
      // indicated end-of-file by itself, allows the stream to close.
      // This does not cancel pending read operations, and if there is such an
      // operation, the process may still not be able to exit successfully
      // until it finishes.
      console.log(stream.read(0));;
    }, 100); 

  } catch (error) {
    console.log(error);
    await fileHandle?.close()
  }
}
fileHandleFun()
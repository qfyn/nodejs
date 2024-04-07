const { Worker, isMainThread, MessageChannel, receiveMessageOnPort } = require('worker_threads');

console.log('isMainThread', isMainThread);
if(isMainThread) {
  const worker = new Worker(__dirname + '\\son.js', {
    workerData: 'son',
  });
  worker.on('message', (message) => {
    console.log('patent get message: ', message);
  });
  worker.on('error', (error) => {
    console.error(error);
  });
  worker.on('exit', (code) => {
    if (code !== 0)
      reject(new Error(`Worker stopped with exit code ${code}`));
  });
  // worker.postMessage('son, Hello!')

  const subChannel = new MessageChannel();
  worker.postMessage({ testPort: subChannel.port1 }, [subChannel.port1]);
  subChannel.port2.on('message', (value) => {
    console.log('received:', value);
  });
  subChannel.port2.postMessage('subChannel.port2');
}


const { port1, port2 } = new MessageChannel();
port1.postMessage({ hello: 'world1' });
console.log('patent get port:', receiveMessageOnPort(port2));


const { parentPort, workerData, MessageChannel, receiveMessageOnPort } = require('worker_threads');

const script = workerData;
console.log('son get message: ', script);
parentPort.postMessage('parent');

parentPort.on('message', (msg) => {
  console.log('parent send message: ', msg.testPort.postMessage);
  msg.testPort.postMessage('the worker is sending this');
  msg.testPort.on('message', (value) => {
    console.log('testPort:', value);
  });
  // msg.testPort.close();
  parentPort.postMessage('parent, Hello')
})


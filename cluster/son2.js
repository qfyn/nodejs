const process = require('process');

process.on('message', (data) => {
  console.log('son2 got message:', data);
  process.send('son2 back')
});
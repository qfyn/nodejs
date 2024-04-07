const process = require('process');

process.on('message', (data) => {
  console.log('son1 got message:', data);
  process.send('son1 back')
});
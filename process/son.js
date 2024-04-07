const process = require('process');

console.log('child');
process.on('message', (data) => {
  console.log('child got message:', data);
  process.send({f: 'data'})
});


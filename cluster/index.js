const cluster = require('cluster');
const http = require('http');
const os = require('os');
const process = require('process');
// const numCPUs = os.availableParallelism();
let server = null
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  const son1 = cluster.fork();
  son1.on('message', (data) => {
    console.log('parent_son1 get message', data);
  });
  son1.send('hello son1');

  const son2 = cluster.fork();
  son2.on('message', (data) => {
    console.log('parent_son2 get message', data);
  });
  son2.send('hello son2');

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  if(!server) {
    console.log('11111');
    server = http.createServer((req, res) => {
      res.end('hello world\n');
    }).listen(8888);
  }

  process.on('message', (data) => {
    console.log('son got message:', process.pid + ': ' + data);
    process.send('son back')
  });

  console.log(`Worker ${process.pid} started`);
}
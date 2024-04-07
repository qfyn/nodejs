const net = require('net');
const path = require('path');
const fs = require('fs');
// net.createServer().listen(
//   path.join('\\\\?\\pipe', process.cwd(), 'myctl')
// );

// const blockList = new net.BlockList();
// blockList.addAddress('123.123.123.123');
// blockList.addRange('10.0.0.1', '10.0.0.10');
// blockList.addSubnet('8592:757c:efae:4e45::', 64, 'ipv6');

// console.log(blockList.check('123.123.123.123'));  // Prints: true
// console.log(blockList.check('10.0.0.3'));  // Prints: true
// console.log(blockList.check('222.111.111.222'));  // Prints: false

// IPv6 notation for IPv4 addresses works:
// console.log(blockList.check('::ffff:7b7b:7b7b', 'ipv6')); // Prints: true
// console.log(blockList.check('::ffff:123.123.123.123', 'ipv6')); // Prints: true

// ----------------------------------------------------------------
// const socketAddress = new net.SocketAddress();
// console.log(socketAddress.address);
// console.log(socketAddress.family);
// console.log(socketAddress.flowlabel);
// console.log(socketAddress.port);
// console.log(socketAddress);


// ----------------------------------------------------------------
// // 此类用于创建 TCP 或 IPC 服务器。
// const server = net.createServer((socket) => {
//   socket.end('goodbye\n');
// }).on('error', (err) => {
//   // Handle errors here.
//   server.close()
//   throw err;
// });

// // Grab an arbitrary unused port.
// server.listen(3000, () => {
//   server.getConnections((err, count) => {
//     console.log('server connections:', count);
//   })
//   console.log('opened server on', server.address());
// });



// ----------------------------------------------------------------
// const fileWriter = fs.createWriteStream('example.txt');
// const server = net.createServer((socket) => {
//   // 'connection' listener.
//   console.log('client connected');
//   socket.on('end', () => {
//     console.log('client disconnected');
//     socket.unpipe(fileWriter);
//     fileWriter.end()
//   });
//   fileWriter.write('hello\r\n');
//   console.log(socket.bytesRead);
//   console.log(socket.address());
//   console.log(socket.localAddress);
//   console.log(socket.remoteAddress);
//   socket.pipe(fileWriter);
// });
// server.on('error', (err) => {
//   throw err;
// });
// server.listen(8124, () => {
//   console.log('server bound');
// });



// // ----------------------------------------------------------------
// const server = new net.Server((socket) => {
//   socket.on('data', (data) => {
//     console.log(data.toString());
//     socket.end()
//   })
//   socket.on('drain', () => {
//     console.log('drained');
//   })
//   socket.on('end', () => {
//     console.log('client disconnected\r\n');
//   })
//   // socket.cork()
//   socket.push('test-----------------');
//   // socket.write('ffffff=-----------------\r\n');
//   // socket.uncork()
//   // socket.pipe(socket)
// })
// server.on('connection', () => {
//   console.log('connection');
// })
// server.on('error', (err) => {
//   throw err;
// })
// server.listen(8124, () => {
//   console.log('opened server on', server.address());
// }); 

// const client = net.createConnection({ port: 8124 }, () => {
//   // 'connect' listener.
//   console.log('connected to server!');
//   client.write('world!\r\n');
// });
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('disconnected from server');
// });
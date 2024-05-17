const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const html = fs.readFileSync(path.resolve(__dirname + '/result/业务数据接口测试.html'));
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
})

server.listen(9000, () => {
  console.log('Server is running on port 3000');
})
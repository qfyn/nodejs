const process = require('process');
const path = require('path');
const { spawn, fork  }= require('child_process');

// process.on('beforeExit', (code) => {
//   console.log('Process beforeExit event with code: ', code);
// });

// process.on('exit', (code) => {
//   console.log('Process exit event with code: ', code);
// });

// console.log('This message is displayed first.');

// Prints:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0

// console.log(process.cwd());
// console.log(process.argv);
// console.log(process.argv0);
// console.log(process.arch);
// console.log(process.channel);
// process.chdir(path.join(__dirname, '..\\os'))
// console.log(process.cwd());
// console.log(process.env);
// console.log(process.memoryUsage());
// queueMicrotask(() => {
//   console.log('This message is displayed after the exit event.');
// })
// process.nextTick(() => {
//   console.log('This message is displayed after the beforeExit event.');
// })
// console.log(process.pid);
// console.log(process.title);



// const subprocess = spawn("ls", ["../"])
// subprocess.on("exit", (code, signal) => {
//   console.log(`子进程退出，退出码 ${code}`);
// })

// const bat = spawn('cmd.exe', ['/c', 'my.bat'])
// bat.stdout.on('data', (data) => {
//   console.log('stdout', data.toString());
// });

// bat.stderr.on('data', (data) => {
//   console.error('stderr', data.toString('utf-8'));
// });
// bat.on('exit', (code) => {
//   console.log(`Child exited with code ${code}`);
// }); 


// const ls = spawn('ls', ['-lh', '/']);

// ls.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// ls.stderr.on('data', (data) => {
//   console.error(`stderr: ${data}`);
// });

// ls.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

// const bat = spawn('node', ['son.js'])
// bat.stdin.on('data', (data) => {
//   console.log('stdin', data.toString());
// });
// bat.stdout.on('data', (data) => {
//   console.log(data.toString('utf-8'))
//   console.log('Buffer.isBuffer(data)', Buffer.isBuffer(data));
//   console.log('stdout', data);
// });
// bat.stderr.on('data', (data) => {
//   console.error('stderr', data.toString('utf-8'));
// });
// bat.on('exit', (code) => {
//   console.log(`Child exited with code ${code}`);
// }); 

let child = null
process.stdin.on("data", data => {
  // data = data.toString().toUpperCase()
  // process.stdout.write(data + "\n")
  child && child.send(data.toString());
  // process.stderr.write("error! some error occurred\n")
})

const controller = new AbortController();
const { signal } = controller;
child = fork(__dirname  + '\\son.js', ['child'], { signal });
child.on('message', (data) => {
  console.log('parent get message', data);
});
child.on('error', (err) => {
  console.error('error', err);
  controller.abort(); // Stops the child process
});
child.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`);
})


child.send({ hello: 'world1' });
// console.log('pid', child.pid);
// setTimeout(() => {
//   child.kill(); // Does not terminate the Node.js process in the shell.
// }, 2000); 
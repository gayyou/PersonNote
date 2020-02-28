// worker.js
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid); // 记录当前工作进程 pid 及父进程 ppid
});

let worker;
process.on('message', function (message, sendHandle) {
  if (message === 'server') {
    worker = sendHandle;
    worker.on('connection', function(socket) {
      server.emit('connection', socket);
    });
  }
});

const fork = require('child_process').fork;
const server = require('net').createServer();
server.listen(3000);

let child = fork('./worker.js');

child.send('server', server);

console.log('processId', process.pid, child.pid);


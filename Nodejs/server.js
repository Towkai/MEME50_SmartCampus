const ip = require('./ip');
const http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {'content-type':'text/html'});
    res.end('Hello world!!');
}).listen(ip.port, () => console.log(`Server running at http://${ip.addr}:${ip.port}`));
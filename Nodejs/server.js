const port=7000;
const http = require('http');
http.createServer(function(req, res) {
    res.writeHead(200, {'content-type':'text/html'});
    res.end('Hello world!!');
}).listen(port, () => console.log(`Server running at http://localhost:${port}`));
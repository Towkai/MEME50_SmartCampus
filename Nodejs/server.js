const ip = require('./ip');
const express = require('express');
const app = express();
app.listen(ip.port, function() {
     console.log(`Server running at http://${ip.addr}:${ip.port}`);
});

app.set('view engine', 'ejs');

var router = require('./router');
app.use('/', router);
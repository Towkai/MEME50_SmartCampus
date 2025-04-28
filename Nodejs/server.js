const ip = require('./ip');
const express = require('express');
const app = express();
app.listen(ip.port, function() {
     console.log(`Server running at http://${ip.addr}:${ip.port}`);
});

app.set('view engine', 'ejs');

var main_router = require('./routers/main_router');
app.use('/', main_router);

var sdrs_router = require('./routers/sdrs_router');
app.use('/sdrs', sdrs_router);

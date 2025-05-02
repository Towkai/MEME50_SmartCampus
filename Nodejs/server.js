const ip = require('./ip');
const cors = require('cors');
const express = require('express');
const path = require('path');
const app = express();
app.listen(ip.port, function () {
     console.log(`Server running at http://${ip.addr}:${ip.port}`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
     origin: ['http://localhost:7000', 'http://218.32.100.27:7000'],
     methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type']
}));

var main_router = require('./routers/main_router');
app.use('/', main_router);

var sdrs_router = require('./routers/sdrs_router');
app.use('/sdrs', sdrs_router);

var sdrs_router = require('./routers/NicoleFoodSystem_router');
app.use('/NicoleFoodSystem', sdrs_router);

var facephoto_router = require('./routers/imageRoutes');
app.use('/SamFacePhoto', facephoto_router);

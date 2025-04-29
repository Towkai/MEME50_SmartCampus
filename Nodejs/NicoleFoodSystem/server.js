const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 6001;
const DATA_FILE = path.join(__dirname, 'temperature_data.txt');

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('❌ 無法讀取溫度資料');
                return;
            }

            const lines = data.trim().split('\n').reverse(); // 最新的在最上面
            let html = '<html><head><title>溫度Dashboard</title></head><body>';
            html += '<h1>🌡️ 溫度列表</h1><ul>';

            lines.forEach(line => {
                html += `<li>${line}</li>`;
            });

            html += '</ul></body></html>';

            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            res.end(html);
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 簡易溫度Dashboard已啟動：http://localhost:${PORT}`);
});

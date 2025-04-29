const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 6011;
const DATA_FILE = path.join(__dirname, 'temperature_data.txt');

// ==== 建立 HTTP 伺服器 ====
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        fs.readFile(DATA_FILE, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('❌ 無法讀取溫度資料');
                return;
            }

            const lines = data.trim().split('\n').reverse();

            let html = `
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="refresh" content="5">
                    <title>🌡️ 溫度 Dashboard</title>
                    <style>
                        body { font-family: sans-serif; padding: 2em; background: #f7f7f7; }
                        h1 { color: #333; }
                        ul { list-style-type: none; padding-left: 0; }
                        li { background: white; margin-bottom: 0.5em; padding: 0.5em 1em; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                    </style>
                </head>
                <body>
                    <h1>🌡️ 溫度列表</h1>
                    <ul>
            `;

            lines.forEach(line => {
                html += `<li>${line}</li>`;
            });

            html += `
                    </ul>
                </body>
                </html>
            `;

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(html);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
    }
});

// ==== 啟動伺服器 ====
server.listen(PORT, () => {
    console.log(`🚀 簡易溫度Dashboard已啟動：http://localhost:${PORT}`);
});
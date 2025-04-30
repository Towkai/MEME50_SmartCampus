const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../', 'temperature_data.txt');

exports.readTemperatureData = () => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  return data.trim().split('\n').reverse();
};

exports.generateHTML = (temperatureData) => {
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

  temperatureData.forEach(line => {
    html += `<li>${line}</li>`;
  });

  html += `
      </ul>
    </body>
    </html>
  `;

  return html;
};
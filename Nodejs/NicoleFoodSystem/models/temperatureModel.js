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
        table { border-collapse: collapse; width: 800px; }
        th, td { border: 1px solid #ccc; padding: 10px; text-align: center; }
        th { background-color: #eee; }
        .high { color: red; font-weight: bold; }
      </style>
    </head>
    <body>
      <h1>🌡️ 溫度列表</h1>
      <table>
        <tr>
          <th>日期</th>
          <th>時間</th>
          <th>攝氏溫度 (°C)</th>
          <th>華氏溫度 (°F)</th>
          <th>是否超標</th>
        </tr>
  `;

  temperatureData.forEach(line => {
    // 解析資料，假設格式為: [Server Received 時:分:秒] 溫度資訊...
    const match = line.match(/\[Server Received (\d+):(\d+):(\d+)\] .*t=(\d+)/);
    if (match) {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const hour = match[1];
      const min = match[2];
      const sec = match[3];
      const tempMilliC = parseInt(match[4]);
      const tempC = tempMilliC / 1000;
      const tempF = (tempC * 9) / 5 + 32;
      const isHigh = tempC >= 30;
      
      html += `
        <tr>
          <td>${date}</td>
          <td>${hour}:${min}:${sec}</td>
          <td>${tempC.toFixed(3)}</td>
          <td>${tempF.toFixed(3)}</td>
          <td${isHigh ? ' class="high"' : ''}>${isHigh ? '是' : '否'}</td>
        </tr>
      `;
    }
  });

  html += `
      </table>
    </body>
    </html>
  `;

  return html;
};
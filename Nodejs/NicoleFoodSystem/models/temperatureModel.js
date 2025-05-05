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
          <th>日期時間</th>
          <th>攝氏溫度 (°C)</th>
          <th>華氏溫度 (°F)</th>
          <th>是否超標</th>
        </tr>
  `;

  // html += temperatureData;
  // html += "<p></p>";
  // html += temperatureData[0].split(' ').pop().split('|');
  
  temperatureData.forEach(line => {
    line = line.split(' ');
    let data = line.pop().split('|');
    let tempC = data[0];
    let tempF = data[1];
    let isHigh = data[2];
    html += '<tr><td>' + line + '</td><td>' + tempC + '</td><td>' + tempF + '</td><td>' + (isHigh == 'TEMP_HIGH' ? "alert" : "safe") + '</td></tr>';
  });

  html += `
      </table>
    </body>
    </html>
  `;

  return html;
};
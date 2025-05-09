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
        table { border-collapse: collapse; width: 90vw; }
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
    line = trimChar(line, '\r').split('/');
    let data = line.pop().split('|');
    let tempC = data.shift();
    let tempF = data.shift();
    let isHigh = data == "TEMP_HIGH" ? "alert" : "safe";

    html += '<tr><td>' + new Date(trimChar(line[0], '[]')).toLocaleString('Taiwan', { hour12: false }) + '</td><td>' + tempC + '</td><td>' + tempF + '</td><td>' + isHigh + '</td></tr>';
  });

  html += `
      </table>
    </body>
    </html>
  `;

  return html;
};
function trimChar(string, chars) {  
  const strArr = string.split('');

  // 找到第一個不排除的字元索引
  const start = strArr.findIndex(ch => !chars.includes(ch));
  if(start === -1) return '';

  // 找到最後一個不排除的字元索引
  let reverseStart = strArr.slice().reverse().findIndex(ch => !chars.includes(ch));
  const end = string.length - reverseStart;

  // 去頭去尾
  return strArr.slice(start, end).join('');
}
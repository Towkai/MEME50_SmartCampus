const temperatureModel = require('../models/temperatureModel');

exports.getTemperatureData = (req, res) => {
  try {
    const temperatureData = temperatureModel.readTemperatureData();
    const html = temperatureModel.generateHTML(temperatureData);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('❌ 無法讀取溫度資料');
  }
};

exports.handle404 = (req, res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
};
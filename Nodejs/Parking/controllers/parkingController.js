const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const path = require('path');

exports.Parking= (req, res) => {
    const publicPath = path.resolve(__dirname, "../../public");
    const filePath = path.join(publicPath, "/data/park_data.csv");
    const status = require(path.join(publicPath, "/data/status.json"));
    json = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
    res.render('parking/Parking', { data: json, status:status });
};
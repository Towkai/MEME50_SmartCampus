const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const path = require('path');

const views = {
    index: "index.ejs"
}

exports.index = (req, res) => {
    res.render(views.index, {message: "example"});  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
};

exports.Parking= (req, res) => {
    const filePath = "./park_data.csv";
    const status = require('./status.json');
    json = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
    res.render('Parking', { data: json, status:status });
};
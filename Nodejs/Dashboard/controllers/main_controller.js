const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const path = require('path');

const views = {
    index: "index.ejs"
}

exports.index = (req, res) => {  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
    res.render(views.index, {message: [
        ["sdrs/getFiles", "獲取檔案"],
    ]});
};

exports.Parking= (req, res) => {
    console.log(req.path)
    //const filePath = "./Nodejs/park_data.csv";
    //const status = require('./Nodejs/status.json');
    //json = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
    res.render('Parking', { data: json, status:status });
};
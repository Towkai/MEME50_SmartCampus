const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const path = require('path');
const subsystem = require('./subsystem');

const views = {
    index: "index.ejs",
    dashboard: "dashboard/view.ejs"
}

exports.index = (req, res) => {  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
    res.render(views.index, {message: [
        ["dashboard/view", "儀錶板"],
        ["sdrs/getFiles", "獲取檔案"],
        ["NicoleFoodSystem", "溫度監控"],
    ]});
};
exports.dashboard = (req, res) => {  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
    res.render(views.dashboard, { urls: subsystem.urls});
};

exports.Parking= (req, res) => {
    const publicPath = path.resolve(__dirname, "../../public");
    const filePath = path.join(publicPath, "/data/park_data.csv");
    const status = require(path.join(publicPath, "/data/status.json"));
    json = csvToJson.fieldDelimiter(',').getJsonFromCsv(filePath);
    res.render('Parking', { data: json, status:status });
};
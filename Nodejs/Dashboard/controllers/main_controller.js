const subsystem = require('./subsystem');

const views = {
    index: "index.ejs",
    dashboard: "dashboard/view.ejs"
}

exports.index = (req, res) => {  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
    res.render(views.index, {message: [
        ["dashboard", "儀錶板"],
        ["parking", "智慧停車場"],
        ["NicoleFoodSystem", "溫度監控"],
        ["feeder", "餵食紀錄"],
        ["SamFacePhoto/videoPhoto", "車輛周邊安全系統"],
        ["sdrs/getFiles", "獲取檔案"],
        ["http://218.32.100.27:1200/s/PFZgyCf9ff2WWzY", "Nextcloud"],
    ]});
};
exports.dashboard = (req, res) => {  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
    res.render(views.dashboard, { urls: subsystem.urls});
};

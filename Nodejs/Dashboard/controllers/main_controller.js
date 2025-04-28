const views = {
    index: "index.ejs"
}

exports.index = (req, res) => {
    res.render(views.index, {message: "example"});  //固定用法：建立名為"views"的資料夾，將指定的ejs檔放在裡面
};
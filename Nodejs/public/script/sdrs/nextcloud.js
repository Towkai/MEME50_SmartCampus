var intervalID = setInterval(checkFile, 5000);

document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', async function () {
        const href = this.getAttribute('data-href').split('/').pop();
        const confirmDelete = confirm(`您確定要刪除 ${href} 嗎？`);
        if (confirmDelete) {
            delFile(href);
        }
    });
});

function delFile(file) {
    hideItem(file);
    axios.delete(url("delFile", file))
        .then(response => {
            // 刪除後重新取得檔案列表
        })
        .catch(error => {
            console.error('刪除檔案時發生錯誤:', error);
        });
}

function getFiles() {
    axios.get(url("getFiles"))
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.error('重新整理時發生錯誤:', error);
        });
}
function checkFile() {
    axios.get(url("checkFile"))
        .then(response => {
            let filecount = response.data["d:multistatus"]["d:response"].length - 1;
            console.log("nextcloud file count: " + filecount);
            let fileExplorer = document.getElementById("fileExplorer");
            if (fileExplorer.childElementCount != filecount)
                window.location.reload();
        })
        .catch(error => {
            console.error('檢查檔案數量:', error);
        });
}

function hideItem(file) {
    let item = document.getElementById(file);
    item.style.display = "none";
}

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

function getFile() {
    axios.get(url("getFiles"))
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.error('重新整理時發生錯誤:', error);
        });
}

function hideItem(file) {
    let item = document.getElementById(file);
    item.style.display = "none";
}
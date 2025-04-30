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

function setItem(datas) {
    let files = Array.from(datas).map(data => data["d:href"][0].split('/').pop());
    let fileExplorer = document.getElementById("fileExplorer");
    let ids = Array.from(fileExplorer.children).map(child => child.id);
    let hideItems = ids.filter(value => !files.includes(value));
    hideItems.forEach(item => hideItem(item));

    let newItems = datas.filter(data => !ids.includes(data["d:href"][0].split('/').pop()));
    newItems.forEach(item => ids > 0 ? fileExplorer.insertBefore(newItem(item), fileExplorer.children[0]) : fileExplorer.append(newItem(item)));
}

function newItem(data) {
    let href = data["d:href"][0];
    let isFolder = href.endsWith('/');
    let item = document.createElement('div');
    item.id = href.split('/').pop();
    item.className = `item ${isFolder ? 'folder' : 'file'}`;
    let span = document.createElement('span');
    span.className = "itemname";
    span.innerText = `${isFolder ? '📁' : '📄'} ${href.split('/').pop()}`;
    item.append(span);
    let div = document.createElement('div');
    div.className = "info";
    span = document.createElement('span');
    span.innerText = isFolder ? "大小: N/A" : `${data["d:propstat"][0]["d:prop"][0]["d:getcontentlength"][0]}`;
    div.append(span);
    span = document.createElement('span');
    span.innerText = `，最後修改時間: ${data["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0]}`;
    div.append(span)
    let button = document.createElement("button");
    button.className = "delete-button";
    button.setAttribute("data-href", href);
    button.innerText = "刪除";
    div.append(button);
    item.append(div);
    return item;
}
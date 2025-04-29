

// 繪製檔案總管
// function setExplorer(jsonData) {
    const fileExplorer = document.getElementById('fileExplorer');
    jsonData["d:multistatus"]["d:response"].forEach(response => {
        const href = response["d:href"][0];
        const isFolder = href.endsWith('/'); // 判斷是否為資料夾
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item ' + (isFolder ? 'folder' : 'file');
        itemDiv.innerHTML = `
                    <span>${isFolder ? '📁' : '📄'} ${href.split('/').pop()}</span>
                    <div class="info">
                        ${isFolder ? '' : '大小: ' + response["d:propstat"][0]["d:prop"][0]["d:getcontentlength"][0] + ' bytes'}
                        ${isFolder ? '' : '，最後修改時間: ' + response["d:propstat"][0]["d:prop"][0]["d:getlastmodified"][0]}
                    </div>
                `;
        fileExplorer.appendChild(itemDiv);
    });
// }
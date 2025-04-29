// 獲取模態框和按鈕
const modal = document.getElementById("myModal");
const playButtons = document.getElementsByClassName("itemname");
const closeButton = document.getElementById("closeButton");
const videoPlayer = document.getElementById("videoPlayer");

// 當按下播放按鈕時顯示模態框
for (let i = 0; i < playButtons.length; i++) {
    playButtons[i].onclick = function(event) {
        videoPlayer.setAttribute("src", path(event.target.innerHTML.split(' ').pop()));
        modal.style.display = "flex"; // 顯示模態框
        videoPlayer.play(); // 播放影片
    }
};

// 當按下關閉按鈕時隱藏模態框
closeButton.onclick = function() {
    modal.style.display = "none"; // 隱藏模態框
    videoPlayer.pause(); // 暫停影片
    videoPlayer.currentTime = 0; // 重置影片到開頭
}

// 當用戶點擊模態框以外的區域時隱藏模態框
window.onclick = function(event) {
    if (event.target === modal.firstElementChild) {
        modal.style.display = "none"; // 隱藏模態框
        videoPlayer.pause(); // 暫停影片
        videoPlayer.currentTime = 0; // 重置影片到開頭
    }
}
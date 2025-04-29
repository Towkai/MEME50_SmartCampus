document.querySelectorAll('.delete-button').forEach(button => {
    button.addEventListener('click', async function() {
        const href = this.getAttribute('data-href');
        const confirmDelete = confirm(`您確定要刪除 ${href.split('/').pop()} 嗎？`);
        if (confirmDelete) {
            try {
                const response = await fetch(href, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // 替換為您的授權令牌
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    alert('刪除成功！');
                    // 刪除成功後可以選擇重新加載頁面或移除該項目
                    location.reload(); // 重新加載頁面
                } else {
                    alert('刪除失敗，請稍後再試。');
                }
            } catch (error) {
                console.error('刪除過程中出現錯誤:', error);
                alert('刪除過程中出現錯誤，請檢查控制台。');
            }
        }
    });
});
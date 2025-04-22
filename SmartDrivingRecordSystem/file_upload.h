#include <stdio.h>
#include <stdlib.h>
#include <sys/stat.h>
#include <curl/curl.h>
#include <string.h>
#include "sdrs.h"
#include "nextcloud.h"
static size_t read_callback(void *ptr, size_t size, size_t nmemb, FILE *stream) {
    size_t retcode = fread(ptr, size, nmemb, stream);
    return retcode;
}
static size_t progress_callback(void *clientp, curl_off_t dltotal, curl_off_t dlnow, curl_off_t ultotal, curl_off_t ulnow) {
    // printf("dltotal: %ld, dlnow: %ld, ultotal: %ld, ulnow: %ld\n", dltotal, dlnow, ultotal, ulnow);

    if (ultotal > 0) {
        printf("Upload progress: %0.2f%%\n", (double)ulnow / ultotal * 100.0);
        // fflush(stdout);
    }
    if (dltotal > 0) {
        printf("Download progress: %0.2f%%\n", (double)dlnow / dltotal * 100.0);
        // fflush(stdout);
    }
    return 0; /* all is good */
}


int file_upload(int argc, char *argv[]) {
    CURL *curl;
    CURLcode res;
    FILE *hd_src;
    char full_filename[512];
    char *filename = argv[1]; // 從命令行參數獲取檔案名稱
    char *url = getNextcloudUrl(filename);

    snprintf(full_filename, sizeof(full_filename), "%s/%s", OUTPUT_DIR, filename);
    // 打開文件
    hd_src = fopen(full_filename, "rb");
    if (!hd_src) {
        printf("Could not open file %s for reading\n", full_filename);
        perror("fopen");
        return 1;
    }
    
    // 獲取文件大小
    struct stat file_info;
    if (stat(full_filename, &file_info) != 0) {
        printf("Could not get file size for %s\n", full_filename);
        perror("stat");
        return 1;
    }

    // 初始化 curl
    curl = curl_easy_init();
    if (curl) {
        // 設置上傳的 URL
        curl_easy_setopt(curl, CURLOPT_URL, url);

        // 設置文件讀取回調
        curl_easy_setopt(curl, CURLOPT_READFUNCTION, read_callback);
        curl_easy_setopt(curl, CURLOPT_READDATA, hd_src);

        // 設置上傳模式
        curl_easy_setopt(curl, CURLOPT_UPLOAD, 1L);

        // 設置進度回調函數
        curl_easy_setopt(curl, CURLOPT_XFERINFOFUNCTION, progress_callback);
        curl_easy_setopt(curl, CURLOPT_NOPROGRESS, 0L); // 啟用進度回調

        // 設置文件大小
        curl_easy_setopt(curl, CURLOPT_INFILESIZE, file_info.st_size);

        // 設置認證 (如果需要)
        curl_easy_setopt(curl, CURLOPT_USERPWD, next_userpwd()); // 替換為你的用戶名和密碼

        // 執行上傳
        res = curl_easy_perform(curl);

        // 檢查上傳結果
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }

        // 清理
        curl_easy_cleanup(curl);
    }

    fclose(hd_src); // 關閉文件
    return 0;
}
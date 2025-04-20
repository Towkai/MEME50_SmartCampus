#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include "sdrs.h"

int main() {
    time_t rawtime;
    struct tm *timeinfo;
    char filename[256];
    char command[512];

    // 確保輸出目錄存在
    char mkdir_command[256];
    snprintf(mkdir_command, sizeof(mkdir_command), "mkdir -p %s", OUTPUT_DIR);
    system(mkdir_command);

    while (1) {
        // 取得目前時間
        time(&rawtime);
        timeinfo = localtime(&rawtime);

        // 產生檔名
        strftime(filename, sizeof(filename), FILENAME_FORMAT, timeinfo);
        char full_filename[512];
        snprintf(full_filename, sizeof(full_filename), "%s/tmp_%s", OUTPUT_DIR, filename);

        // 產生 libcamera-vid 命令
        snprintf(command, sizeof(command),
                 "libcamera-vid -t %d000 -o %s --codec h264 --width 1920 --height 1080",
                 RECORD_DURATION, full_filename);

        // 執行 libcamera-vid 命令
        printf("執行命令: %s\n", command);
        int result = system(command);

        if (result == 0) {
            printf("成功錄製: %s\n", full_filename);
            snprintf(command, sizeof(command),
                     "mv tmp_%s %s/%s",
                     full_filename, OUTPUT_DIR, filename);
            int result = system(command);
        } else {
            fprintf(stderr, "錄製失敗，返回碼: %d\n", result);
        }

        // 等待下一次錄製
        sleep(1);
    }

    return 0;
}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <fcntl.h>
#include <pthread.h>
#include <sys/wait.h>
#include <sys/types.h>
#include "sdrs.h"
#include "file_upload.h"
#define FIFO_PATH "/tmp/sdrs_fifo"

void* thread_function(void* arg);

int main() {
    // 確保輸出目錄存在
    char mkdir_command[256];
    snprintf(mkdir_command, sizeof(mkdir_command), "mkdir -p %s", OUTPUT_DIR);
    system(mkdir_command);

    // 確保 FIFO 文件存在
    if (access(FIFO_PATH, F_OK) != 0)
        mkfifo(FIFO_PATH, 0666);

    while (1) {
        // 建立子執行緒
        pthread_t thread_id;
        if (pthread_create(&thread_id, NULL, thread_function, NULL) != 0) {
            perror("pthread_create");
            exit(1);
        }

        // 以讀取模式打開 FIFO
        int fd = open(FIFO_PATH, O_RDONLY);
        if (fd == -1) {
            perror("open");
            exit(1);
        }

        // 從 FIFO 讀取資料,只讀取第一行
        char buffer[1024];
        if (fgets(buffer, sizeof(buffer), fdopen(fd, "r")) == NULL) {
            perror("fgets");
            exit(1);
        }
        printf("Parent received: %s", buffer);

        // 等待子執行緒結束
        pthread_join(thread_id, NULL);
    }

    return 0;
}

void* thread_function(void* arg) {
        // 取得目前時間
        time_t rawtime;
        struct tm *timeinfo;
        time(&rawtime);
        timeinfo = localtime(&rawtime);

        // 產生檔名
        char filename[256];
        strftime(filename, sizeof(filename), FILENAME_FORMAT, timeinfo);
        char full_filename[512];
        snprintf(full_filename, sizeof(full_filename), "%s/tmp_%s", OUTPUT_DIR, filename);

        // 產生 libcamera-vid 命令
        char command[512];
        snprintf(command, sizeof(command),
                "libcamera-vid -t %d000 -o %s --codec h264 --width 1920 --height 1080",
                RECORD_DURATION, full_filename);

        // 執行 libcamera-vid 命令
        printf("執行命令: %s\n", command);
        int result = system(command);

        if (result == 0) {
            printf("成功錄製: %s\n", full_filename);
            snprintf(command, sizeof(command),
                    "mv %s %s/%s",
                    full_filename, OUTPUT_DIR, filename);
            int result = system(command);

            int fd = open(FIFO_PATH, O_WRONLY);
            if (fd == -1) {
                perror("open");
                exit(1);
            }
            write(fd, strcat(full_filename, "\n"), strlen(full_filename));
            close(fd);
        } else {
            fprintf(stderr, "錄製失敗，返回碼: %d\n", result);
        }

        // 等待下一次錄製
        sleep(1);
    return NULL;
}
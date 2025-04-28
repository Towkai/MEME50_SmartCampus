#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>
#include <fcntl.h>
#include <pthread.h>
#include <sys/wait.h>
#include <sys/types.h>
#include <sys/stat.h>
#include "sdrs.h"
#include "file_upload.h"

void* thread_camera(void* arg);
void* thread_upload(void* arg);
extern int file_upload(char* filename);

int main() {
    // 確保輸出目錄存在
    char mkdir_command[256];
    snprintf(mkdir_command, sizeof(mkdir_command), "mkdir -p %s", OUTPUT_DIR);
    system(mkdir_command);

    while (1) {
        // 建立子執行緒
        pthread_t thread_camera_id;
        pthread_t thread_upload_id;
        int res;
        void *thread_result;
        res = pthread_create(&thread_camera_id, NULL, thread_camera, NULL);
        if (res != 0) {
            perror("Thread creation failed");
            exit(1);
        }
        // 等待子執行緒結束
        res = pthread_join(thread_camera_id, &thread_result);
        if (res != 0 || thread_result == NULL) {
            perror("Thread join failed");
            exit(EXIT_FAILURE);
        }
        // printf("Thread finished with result: %s\n", (char*)thread_result);
        pthread_create(&thread_upload_id, NULL, thread_upload, (char*)thread_result);

        // printf("Parent received: %s\n", (char*)thread_result);
        // 等待下一次錄製
        // sleep(1);
    }
    return 0;
}

void* thread_camera(void* arg) {
    // 取得目前時間
    time_t rawtime;
    struct tm *timeinfo;
    time(&rawtime);
    timeinfo = localtime(&rawtime);

    // 產生檔名
    char filename[512];
    strftime(filename, sizeof(filename), FILENAME_FORMAT, timeinfo);
    char temp_filename[512];
    snprintf(temp_filename, sizeof(temp_filename), "%s/tmp_%s", OUTPUT_DIR, filename);

    // 產生 libcamera-vid 命令
    char command[512];
    snprintf(command, sizeof(command),
            "libcamera-vid -t %d000 -o %s --codec h264 --width 1920 --height 1080",
            RECORD_DURATION, temp_filename);

    // 執行 libcamera-vid 命令
    printf("執行命令: %s\n", command);
    int result = system(command);
    if (result == 0) {
        snprintf(command, sizeof(command),
                "mv %s %s/%s",
                temp_filename, OUTPUT_DIR, filename);
        int result = system(command);
        // int result = execlp("mv", "mv", temp_filename, full_filename, NULL);
    } else {
        fprintf(stderr, "錄製失敗，回傳碼: %d\n", result);
        pthread_exit(NULL);
    }
    printf("錄製完成: %s\n", filename);
    pthread_exit(filename);
}


void* thread_upload(void* arg) {
    int result = file_upload((char*)arg);
    
    if (result == 0)
    printf("File upload successful.\n");
    else
    printf("File upload failed.\n");
}

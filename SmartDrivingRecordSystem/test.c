#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "sdrs.h"
#include "file_upload.h"

extern int file_upload(char* filename);

char* systemcall(char* command) {
    FILE *fp;
    char *result = (char *)malloc(256);
    if (result == NULL) {
        perror("malloc failed");
        return NULL;
    }
    fp = popen(command, "r");
    if (fp == NULL) {
        perror("popen failed");
        free(result);
        return NULL;
    }
    fgets(result, 256, fp);
    pclose(fp);
    return result;
}

int main(int argc, char *argv[]) {
    // 測試上傳功能
    char command[256];
    char test_filename[256];
    if (argc > 1) {
        snprintf(test_filename, sizeof(test_filename), "%s", argv[1]);
    } 
    else {
        snprintf(test_filename, sizeof(test_filename), "test_%ld.mp4", time(NULL));
    }
    snprintf(command, sizeof(command), "touch %s/%s", OUTPUT_DIR, test_filename);
    system(command);

    int result = file_upload(test_filename);
    if (result == 0) {
        printf("File upload successful.\n");
    } else {
        printf("File upload failed.\n");
    }
    return 0;
}
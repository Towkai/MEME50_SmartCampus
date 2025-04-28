#include <stdio.h>
#include <stdlib.h>
#include "file_list.h"
#include "nextcloud.h"

int main(int argc, char *argv[]) {
    FILE *fp;
    char buffer[65536];
    char command[128]; // 使用 curl 命令

    snprintf(command, sizeof(command), "curl -u team-fire:teamfire1234 -X PROPFIND %s -H Depth: 1 -s", getNextcloudUrl(argc > 1 ? argv[1] : ""));
    printf("command: %s\n", command);
    // 使用 popen 執行命令並獲取輸出
    fp = popen(command, "r");
    if (fp == NULL) {
        perror("popen failed");
        return 1;
    }

    // 讀取命令的輸出
    while (fgets(buffer, sizeof(buffer), fp) != NULL) {
        printf("%s", buffer);
    }

    // 關閉管道
    if (pclose(fp) == -1) {
        perror("pclose failed");
        return 1;
    }

    return 0;
}
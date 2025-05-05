#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <time.h>

#define SERVER_PORT 6001
#define BUFFER_SIZE 512
#define OUTPUT_FILE "temperature_data.txt"

//開一個 TCP Server ➔ 等上傳器送資料 ➔ 收到就加時間記錄 ➔ 存成溫度資料檔案 (temperature_data.txt)

void save_data_with_timestamp(const char *data) {
    FILE *fp = fopen(OUTPUT_FILE, "a"); //打開 temperature_data.txt（以 "append" 模式）
    if (fp == NULL) {
        perror("❌ 無法開啟資料檔案");
        return;
    }

    // 加上Server收到的時間
    // time_t now = time(NULL);
    // struct tm *t = localtime(&now);
    // fprintf(fp, "[Server Received %02d:%02d:%02d] %s",
    //         t->tm_hour, t->tm_min, t->tm_sec, data);

    fprintf(fp, "%s", data);

    fclose(fp);
}

int main() {
    int server_fd, client_fd;
    struct sockaddr_in server_addr, client_addr;
    socklen_t client_len = sizeof(client_addr);
    char buffer[BUFFER_SIZE];

    server_fd = socket(AF_INET, SOCK_STREAM, 0);  //建立 Server socket
    if (server_fd < 0) {
        perror("❌ 無法建立Server socket");
        return 1;
    }

    //綁定本機 IP + Port
    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = INADDR_ANY; // 本地所有IP
    server_addr.sin_port = htons(SERVER_PORT); 

    //綁定 Bind把這個socket綁到設定好的 IP+Port 上
    if (bind(server_fd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
        perror("❌ 綁定失敗");
        close(server_fd);
        return 1;
    }

    if (listen(server_fd, 5) < 0) {
        perror("❌ 監聽失敗");
        close(server_fd);
        return 1;  //允許最多5個Client同時排隊等待連線
    }

    printf("📡 升級版溫度Server啟動，監聽Port %d...\n", SERVER_PORT);

    while (1) {
        client_fd = accept(server_fd, (struct sockaddr *)&client_addr, &client_len);
        if (client_fd < 0) {
            perror("❌ 接收client失敗");
            continue;
        }

        memset(buffer, 0, sizeof(buffer));
        read(client_fd, buffer, sizeof(buffer) - 1);

        printf("📥 收到資料：%s", buffer);

        save_data_with_timestamp(buffer);

        close(client_fd);
        /*把收到的資料讀到 buffer，再印到畫面，再用 save_data_with_timestamp() 存起來*/
    }

    close(server_fd);
    return 0;
}

/*[上傳器 temp_uploader]
    ↓ (每2秒送一筆資料)
[Server socket接收]
    ↓
[加上Server收到的時間戳記]
    ↓
[存到 temperature_data.txt 檔案]*/

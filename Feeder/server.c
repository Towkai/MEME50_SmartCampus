#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 6002

int main() {
    int server_fd, client_sock, c;
    struct sockaddr_in server, client;
    char buffer[1024];

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == -1) {
        printf("making socket failed\n");
        return 1;
    }

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = INADDR_ANY;
    server.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&server, sizeof(server)) < 0) {
        perror("bind failed");
        return 1;
    }

    listen(server_fd, 3);
    printf("waiting for connections on port %d...\n", PORT);

    while (1) {
        c = sizeof(struct sockaddr_in);
        client_sock = accept(server_fd, (struct sockaddr *)&client, (socklen_t*)&c);
        if (client_sock < 0) {
            perror("accept failed");
            continue;
        }

        printf("client connected\n");

        FILE* file = fopen("feed_log_server.csv", "w"); // 開啟 append 模式
        if (!file) {
            printf("open store file failed\n");
            close(client_sock);
            continue;
        }

        while (1) {
            int read_size = recv(client_sock, buffer, sizeof(buffer)-1, 0);
            if (read_size <= 0) break;
            buffer[read_size] = '\0';
            fputs(buffer, file);
        }

        fclose(file);
        close(client_sock);
        printf("client disconnected, waiting for next...\n");
    }

    close(server_fd);
    return 0;
}

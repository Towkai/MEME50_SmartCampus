// server.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>

#define SERVER_PORT 6003
#define SAVE_FOLDER "../../Nodejs/public/web_images"

void receive_images(int client_sock)
{
    while (1)
    {
        int name_len;
        ssize_t n = read(client_sock, &name_len, sizeof(name_len));
        if (n == 0)
        {
            printf("Client disconnected\n");
            break;
        }
        else if (n < 0)
        {
            perror("read name_len");
            break;
        }
        else if (n != sizeof(name_len))
        {
            fprintf(stderr, "Incomplete name_len\n");
            break;
        }

        char filename[256] = {0};
        if (read(client_sock, filename, name_len) != name_len)
        {
            perror("read filename");
            break;
        }
        filename[name_len] = '\0';

        int size_net;
        if (read(client_sock, &size_net, sizeof(size_net)) != sizeof(size_net))
        {
            perror("read size");
            break;
        }

        int img_size = ntohl(size_net);
        printf("Receiving file '%s' of size: %d bytes\n", filename, img_size);

        char save_path[512];
        snprintf(save_path, sizeof(save_path), "%s/%s", SAVE_FOLDER, filename);
        FILE *fp = fopen(save_path, "wb");
        if (!fp)
        {
            perror("fopen");
            break;
        }

        int received = 0;
        char buffer[4096];
        while (received < img_size)
        {
            ssize_t to_read = (img_size - received > sizeof(buffer)) ? sizeof(buffer) : (img_size - received);
            ssize_t bytes = read(client_sock, buffer, to_read);
            if (bytes <= 0)
            {
                perror("read data");
                break;
            }
            fwrite(buffer, 1, bytes, fp);
            received += bytes;
        }

        fclose(fp);
        printf("File saved: %s\n", filename);
    }
}

int main()
{
    int server_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (server_sock < 0)
    {
        perror("socket");
        exit(1);
    }

    struct sockaddr_in serv_addr = {0};
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = INADDR_ANY;
    serv_addr.sin_port = htons(SERVER_PORT);

    if (bind(server_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0)
    {
        perror("bind");
        close(server_sock);
        exit(1);
    }

    if (listen(server_sock, 5) < 0)
    {
        perror("listen");
        close(server_sock);
        exit(1);
    }

    printf("Server listening on port %d...\n", SERVER_PORT);

    while (1)
    {
        struct sockaddr_in client_addr;
        socklen_t addrlen = sizeof(client_addr);
        int client_sock = accept(server_sock, (struct sockaddr *)&client_addr, &addrlen);
        if (client_sock < 0)
        {
            perror("accept");
            continue;
        }
        printf("Client connected\n");
        receive_images(client_sock);
        close(client_sock);
    }

    close(server_sock);
    return 0;
}

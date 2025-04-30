#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <dirent.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <sys/stat.h>
#include <time.h>

#define SERVER_IP "127.0.0.1"
#define SERVER_PORT 6003
#define FOLDER_PATH "./images"
#define SLEEP_SECONDS 3

int send_file(int sockfd, const char *filepath, const char *filename)
{
    FILE *fp = fopen(filepath, "rb");
    if (!fp)
    {
        perror("fopen");
        return -1;
    }

    fseek(fp, 0, SEEK_END);
    int filesize = ftell(fp);
    fseek(fp, 0, SEEK_SET);

    int name_len = strlen(filename);
    if (send(sockfd, &name_len, sizeof(int), 0) != sizeof(int))
    {
        perror("send name_len");
        fclose(fp);
        return -1;
    }

    if (send(sockfd, filename, name_len, 0) != name_len)
    {
        perror("send filename");
        fclose(fp);
        return -1;
    }

    if (send(sockfd, &filesize, sizeof(int), 0) != sizeof(int))
    {
        perror("send filesize");
        fclose(fp);
        return -1;
    }

    char buffer[4096];
    int bytes_read;
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), fp)) > 0)
    {
        if (send(sockfd, buffer, bytes_read, 0) != bytes_read)
        {
            perror("send file content");
            fclose(fp);
            return -1;
        }
    }

    fclose(fp);
    return 0;
}

int is_jpg(const char *filename)
{
    const char *ext = strrchr(filename, '.');
    return ext && strcmp(ext, ".jpg") == 0;
}

int main()
{
    while (1)
    {
        DIR *dir = opendir(FOLDER_PATH);
        if (!dir)
        {
            perror("opendir");
            sleep(SLEEP_SECONDS);
            continue;
        }

        struct dirent *entry;
        while ((entry = readdir(dir)) != NULL)
        {
            if (!is_jpg(entry->d_name))
                continue;

            char filepath[512];
            snprintf(filepath, sizeof(filepath), "%s/%s", FOLDER_PATH, entry->d_name);

            int sockfd = socket(AF_INET, SOCK_STREAM, 0);
            if (sockfd < 0)
            {
                perror("socket");
                continue;
            }

            struct sockaddr_in server_addr;
            server_addr.sin_family = AF_INET;
            server_addr.sin_port = htons(SERVER_PORT);
            inet_pton(AF_INET, SERVER_IP, &server_addr.sin_addr);

            if (connect(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0)
            {
                perror("connect");
                close(sockfd);
                continue;
            }

            printf("傳送: %s\n", filepath);
            if (send_file(sockfd, filepath, entry->d_name) == 0)
            {
                if (remove(filepath) == 0)
                    printf("已刪除: %s\n", filepath);
                else
                    perror("remove");
            }

            close(sockfd);
        }

        closedir(dir);
        sleep(SLEEP_SECONDS);
    }

    return 0;
}

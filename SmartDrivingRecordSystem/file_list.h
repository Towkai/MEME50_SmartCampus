#ifndef file_list_H
#define file_list_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 定義檔案結構
typedef struct FileInfo {
    char *path;
    char *lastModified;
    long contentLength;
    char *etag;
    char *contentType;
    struct FileInfo *next; // 指向下一個檔案
} FileInfo;

// 函數聲明
FileInfo *createFileInfo(const char *path, const char *lastModified, long contentLength, const char *etag, const char *contentType);
void freeFileList(FileInfo *head);
void appendFile(FileInfo **head, FileInfo *newFile);
void displayFileList(FileInfo *head);

// 函數用於創建新的檔案節點
FileInfo *createFileInfo(const char *path, const char *lastModified, long contentLength, const char *etag, const char *contentType) {
    FileInfo *newFile = (FileInfo *)malloc(sizeof(FileInfo));
    newFile->path = strdup(path);
    newFile->lastModified = strdup(lastModified);
    newFile->contentLength = contentLength;
    newFile->etag = strdup(etag);
    newFile->contentType = strdup(contentType);
    newFile->next = NULL;
    return newFile;
}

// 函數用於釋放串列中的記憶體
void freeFileList(FileInfo *head) {
    FileInfo *current = head;
    while (current != NULL) {
        FileInfo *temp = current;
        current = current->next;
        free(temp->path);
        free(temp->lastModified);
        free(temp->etag);
        free(temp->contentType);
        free(temp);
    }
}

// 函數用於新增檔案到串列
void appendFile(FileInfo **head, FileInfo *newFile) {
    if (*head == NULL) {
        *head = newFile;
    } else {
        FileInfo *current = *head;
        while (current->next != NULL) {
            current = current->next;
        }
        current->next = newFile;
    }
}

// 函數用於顯示串列中的檔案資訊
void displayFileList(FileInfo *head) {
    FileInfo *current = head;
    while (current != NULL) {
        printf("Path: %s\n", current->path);
        printf("Last Modified: %s\n", current->lastModified);
        printf("Content Length: %ld bytes\n", current->contentLength);
        printf("ETag: %s\n", current->etag);
        printf("Content Type: %s\n\n", current->contentType);
        current = current->next;
    }
}
#endif // file_list_H
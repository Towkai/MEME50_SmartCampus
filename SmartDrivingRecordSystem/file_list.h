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

#endif // file_list_H
#ifndef NEXTCLOUD_H
#define NEXTCLOUD_H

#define NEXTCLOUD_IP "218.32.100.27"
#define NEXTCLOUD_PORT 1200
#define NEXTCLOUD_USERNAME "team-fire"
#define NEXTCLOUD_PASSWORD "teamfire1234"
#define NEXTCLOUD_PATH "Videos"

char *next_userpwd() {
    static char userpwd[32];
    snprintf(userpwd, sizeof(userpwd), "%s:%s", NEXTCLOUD_USERNAME, NEXTCLOUD_PASSWORD);
    return userpwd;
}

char *getNextcloudUrl(const char *filename) {
    static char url[256];
    snprintf(url, sizeof(url), "http://%s:%d/remote.php/dav/files/%s/%s/%s", NEXTCLOUD_IP, NEXTCLOUD_PORT, NEXTCLOUD_USERNAME, NEXTCLOUD_PATH, filename);
    return url;
}

#endif // NEXTCLOUD_H
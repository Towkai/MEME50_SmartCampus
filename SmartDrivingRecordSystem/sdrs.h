#ifndef SDRS_H
#define SDRS_H

#ifndef RELEASE
#define RECORD_DURATION 3
#else
#define RECORD_DURATION 10
#endif

#define OUTPUT_DIR "/home/pi/DCIM/Camera" // 請替換成您的硬碟路徑
#define FILENAME_FORMAT "video_%Y%m%d_%H%M%S.mp4"

#endif // SDRS_H
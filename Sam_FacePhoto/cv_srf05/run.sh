#!/bin/bash

BASE_DIR=$(pwd)

# echo "[*] 啟動 client..."
# ./socket_client >> socket_client.log 2>&1 &
# echo $! > socket_client.pid

sleep 1

cd "BASE_DIR/device_driver/led_driver"
make

cd "BASE_DIR"

echo "[*] 載入 LED 驅動..."
sudo insmod /home/sam/cv_srf05/device_driver/led_driver/led_driver.ko

echo "[*] 啟用 Python 環境..."
source ~/cv_srf05/venv/bin/activate

echo "[*] 執行 detect_01.py..."
python3 ~/cv_srf05/detect_01.py

echo "[*] 關閉 Python 環境..."
deactivate

# echo "[*] 關閉 client..."
# kill $(cat client.pid)
# rm socket_client.pid

echo "[*] 卸載驅動..."
sudo rmmod led_driver

cd "BASE_DIR/device_driver/led_driver"
make clean

cd "BASE_DIR"
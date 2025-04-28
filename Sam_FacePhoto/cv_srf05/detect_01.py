from flask import Flask, Response ,render_template,send_from_directory
import os
import cv2
from ultralytics import YOLO
import time
import serial
import datetime
import subprocess

# ==== UART 設定 ====
SERIAL_PORT = '/dev/ttyUSB0'
BAUD_RATE = 115200
ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)

# ==== 初始化變數 ====
distance_cm = 999
last_capture_time = 0
CAPTURE_INTERVAL = 5

# ==== YOLO 模型載入 ====
model = YOLO("yolo11n.pt")
cap = cv2.VideoCapture(0)
prev_time = time.time()

# ==== Flask App ====
app = Flask(__name__)

@app.route('/')
def index():
    return render_template("index.html", username=app)

def generate_frames():
    global distance_cm, last_capture_time, prev_time

    while True:
        # UART 接收距離資料
        if ser.in_waiting > 0:
            line = ser.readline().decode().strip() #.decode()把bytes轉成字串.strip()去掉前後的空白字元
            try:
                distance_cm = float(line)
                print("[UART] 距離:", distance_cm, "cm")
            except ValueError:
                print("[UART] 無效距離資料:", line)

        ret, frame = cap.read() #ret是一個布林值 frame會是一張照片 cap.read()是opencv函式，用來讀取VideoCapture裝置中的一幀影像
        if not ret:
            break

        # YOLO 人物偵測
        results = model(frame, imgsz=256, conf=0.7,verbose=False)
        has_person = False
        for box in results[0].boxes:
            cls = int(box.cls[0])
            conf = box.conf[0].item()
            if cls == 0:
                has_person = True
                xyxy = box.xyxy[0].cpu().numpy().astype(int)
                x1, y1, x2, y2 = xyxy
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(frame, f'Person {conf:.2f}', (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # 顯示 FPS 跟距離
        now = time.time()
        fps = 1 / (now - prev_time)
        prev_time = now
        cv2.putText(frame, f'FPS: {fps:.2f}', (10, 25),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        cv2.putText(frame, f'Distance: {distance_cm:.1f} cm', (10, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 255), 2)

        # 拍照儲存
        current_time = time.time()
        if distance_cm < 10 and has_person:
            if current_time - last_capture_time >= CAPTURE_INTERVAL:
                subprocess.run("echo 'on' | sudo tee /dev/mychardev", shell=True)
                time.sleep(1)
                subprocess.run("echo 'off' | sudo tee /dev/mychardev", shell=True)

                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                folder = 'images'
                os.makedirs(folder, exist_ok=True)
                filename = f"{timestamp}.jpg"
                filepath = os.path.join(folder, filename)
                cv2.imwrite(filepath, frame)
                print(f"[!] 已拍照並儲存為 {filename}")
                last_capture_time = current_time

        # 串流畫面
        ret, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/latest_photo')
def latest_photo():
    folder = 'images'
    if not os.path.exists(folder):
        return "no image", 404

    files = sorted(os.listdir(folder), reverse=True)
    if not files:
        return "no image", 404

    latest = files[0]
    return latest

@app.route('/images/<filename>')
def images(filename):
    return send_from_directory('images', filename)

# 啟動伺服器
if __name__ == '__main__':
    subprocess.run("echo 'off' | sudo tee /dev/mychardev", shell=True)
    app.run(host='0.0.0.0', port=5000)

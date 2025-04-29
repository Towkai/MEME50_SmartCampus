import socket

HOST = socket.gethostname()
PORT = 6000

if __name__ == "__main__":
	print("Start")
	s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
	s.bind((HOST,PORT))
	s.listen(5)

	print('server start at %s:%s'%(HOST,PORT))
	print('wait for connection...')

	while True:
		conn,addr=s.accept()
		print('connected by' +str(addr))
		while True:
			indata = (conn.recv(1024))
			if len(indata) == 0:
				conn.close()
				print('client closed connection')
				break
			m = indata.decode().split(",")
			print(m[1])
			if m[1].endswith("start"):
				with open("./Nodejs/data/status.json","w")as file2:
					file2.write("{\"status\":\"parked\"}")
				with open("./Nodejs/data/park_data.json", "a") as file1:
					file1.write("ParkSpace,Status,Time,TotalParkingTime\n")
					file1.write(indata.decode()+"\n")
					file1.close()
			elif m[1].endswith("leave"):
				with open("./Nodejs/data/status.json","w")as file2:
					file2.write("{\"status\":\"spaced\"}")
				f = open("./Nodejs/data/park_data.json","a")
				f.write(indata.decode()+"\n")
				f.close()

			print('recv: ' + indata.decode())
			outdata = 'echo '+ indata.decode()
			conn.send(outdata.encode())
	s.close()

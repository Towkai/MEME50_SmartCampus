import socket

HOST = socket.gethostname()
PORT = 3000

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
			if m[1] == "start":
				with open("status.json","w")as file2:
					file2.write("{\"status\":\"parked\"}")
				with open("park_data.csv", "w") as file1:
					file1.write("ParkSpace,Status,Time,TotalParkingTime\n")
					file1.write(indata.decode()+"\n")
					file1.close()
			elif m[1] == "leave":
				with open("status.json","w")as file2:
					file2.write("{\"status\":\"spaced\"}")
				f = open("park_data.csv","a")
				f.write(indata.decode()+"\n")
				f.close()

			print('recv: ' + indata.decode())
			outdata = 'echo '+ indata.decode()
			conn.send(outdata.encode())
	s.close()

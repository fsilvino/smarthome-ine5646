import socket
import select
from handler import Handler
from manager import Manager

def startServer():
    print('Starting server...')
    port = 5000
    host = ''
    address = (host, port)
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(address)
    server_socket.listen(4)

    print('Server is listening...', address)

    while True:
        r, w, err = select.select((server_socket,), (), (), 10)
        if r:
            for readable in r:
                print('Wainting for a connection...')
                client, client_addr = server_socket.accept()
                try:
                    handleRequest(client)
                except OSError as e:
                    pass

        checkTemperature()

def checkTemperature():
    manager = Manager()
    temp = manager.readTemperature()
    print("Temperature: " + str(temp) + "C")
    notifyTemperatureToServer(temp)

def notifyTemperatureToServer(temperatura):
    print('Notify server!')

def handleRequest(client):
    message = client.read()
    handler = Handler(message)
    handler.process()
    client.write(handler.response())

startServer()

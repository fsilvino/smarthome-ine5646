import gc
import socket
import select
import config
import network
from handler import Handler
from manager import Manager

def startServer():
    print('Starting server...')
    port = config.socketPort
    host = ''
    address = (host, port)
    server_socket = socket.socket()#(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind(address)
    server_socket.listen(1)

    print('Server is listening...', address)

    while True:
        print('Wainting for a connection...')
        client, client_addr = server_socket.accept()
        try:
            handleRequest(client)
        except OSError as e:
            pass

        gc.collect()
        gc.mem_free()

    # while True:
    #     r, w, err = select.select((server_socket,), (), (), 10)
    #     if r:
    #         for readable in r:
    #             print('Wainting for a connection...')
    #             client, client_addr = server_socket.accept()
    #             try:
    #                 handleRequest(client)
    #             except OSError as e:
    #                 pass

    #     checkTemperature()

def checkTemperature():
    manager = Manager()
    temp = manager.readTemperature()
    print("Temperature: " + str(temp) + "C")
    notifyTemperatureToServer(temp)

def notifyTemperatureToServer(temperature):
    print('Notify server!')
    # host = config.serverHost
    # path = "/api/temperature/" + str(temperature)
    # addr = socket.getaddrinfo(host, config.serverPort)[0][-1]
    # s = socket.socket()
    # s.connect(addr)
    # s.send(bytes('PUT /%s HTTP/1.0\r\nHost: %s\r\n\r\n' % (path, host), 'utf8'))
    # s.close()

def handleRequest(client):
    message = client.read()

    # cl_file = client.makefile('rwb', 0)
    # while True:
    #     line = cl_file.readline()
    #     if not line:
    #         break
    #     message += line
    
    print("Message received: ", message)
    
    handler = Handler(message)
    handler.process()

    response = handler.response()

    print("Responding: ", response)

    client.write(response)
    client.close()

def connectWifi(ssid, password):
    print("Connecting to ", ssid)
    n = network.WLAN(network.STA_IF)
    if not n.isconnected():
        n.connect(ssid, password)
        n.config('mac')
    print("Connected: ", n.isconnected())
    print(n.ifconfig())


def connectAndStart(ssid, password):
    connectWifi(ssid, password)
    startServer()
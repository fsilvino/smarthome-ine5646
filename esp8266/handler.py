import ujson as json
from manager import Manager

class Handler:

    def __init__(self, strJson):
        self.manager = Manager()
        self.json = json.loads(strJson.strip())
        self.value = 0
        self.status = 0
        self.message = ""

    def process(self):
        try:
            if self.json["action"] == 'read':
                self.processRead()
            elif self.json["action"] == 'write':
                self.processWrite()
            if self.status == 0:
                self.success()
        except Exception as e:
            self.status = 3
            self.value = 0
            self.message = e.strerror
            pass

    def processRead(self):
        if self.json["item"] == 'temperature':
            self.readTemperature()
        elif self.json["item"] == 'light':
            self.readLightValue()
        else:
            self.invalidOperation()

    def processWrite(self):
        if self.json["item"] == 'light':
            self.writeLightValue()
        else:
            self.invalidOperation()

    def readTemperature(self):
        self.value = self.manager.readTemperature()

    def readLightValue(self):
        self.value = self.manager.readLightValue()

    def writeLightValue(self):
        self.manager.writeLightValue(self.json["value"])

    def success(self):
        self.status = 1
        self.message = "Success!"

    def invalidOperation(self):
        self.status = 2
        self.message = "Invalid operation!"

    def response(self):
        if self.json["action"] == 'read':
            return json.dumps({ b'status': self.status, b'message': self.message, b'value': self.value })
        else:
            return json.dumps({ b'status': self.status, b'message': self.message })

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
        elif self.json["item"] == 'light1':
            self.readLight1Value()
        elif self.json["item"] == 'light2':
            self.readLight2Value()
        else:
            self.invalidOperation()

    def processWrite(self):
        if self.json["item"] == 'light1':
            self.writeLight1Value()
        elif self.json["item"] == 'light2':
            self.writeLight2Value()
        else:
            self.invalidOperation()

    def readTemperature(self):
        self.value = self.manager.readTemperature()

    def readLight1Value(self):
        self.value = self.manager.readLight1Value()

    def readLight2Value(self):
        self.value = self.manager.readLight2Value()

    def writeLight1Value(self):
        self.manager.writeLight1Value(self.json["value"])

    def writeLight2Value(self):
        self.manager.writeLight2Value(self.json["value"])

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

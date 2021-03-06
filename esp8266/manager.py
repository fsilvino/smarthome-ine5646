import machine
import config

class Manager:

    def readTemperature(self):
        analogValue = config.pinThermometer.read()
        print("readTemperature: analogValue = ", analogValue)
        mV = (analogValue / 1024.0) * 3300
        print("readTemperature: mV = ", mV)
        celsius = mV / 10
        print("readTemperature: celsius = ", celsius)
        return celsius

    def readLight1Value(self):
        return config.pinLight1.value()

    def readLight2Value(self):
        return config.pinLight2.value()

    def writeLight1Value(self, value):
        config.pinLight1.value(value)
        print("New value of Light 1: ", self.readLight1Value())

    def writeLight2Value(self, value):
        config.pinLight2.value(value)
        print("New value of Light 2: ", self.readLight2Value())

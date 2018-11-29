import machine
import config

class Manager:

    def readTemperature(self):
        analogValue = config.pinThermometer.read()
        mV = (analogValue / 1024.0) * 3300
        celsius = mV / 10
        return celsius

    def readLightValue(self):
        return config.pinLight.value()

    def writeLightValue(self, value):
        config.pinLight.value(value)
        print("New value of Light: ", self.readLightValue())

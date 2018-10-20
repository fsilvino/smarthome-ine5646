from machine import Pin
from machine import ADC

pinThermometer = ADC(0)
pinLight1 = Pin(12, Pin.OUT)
pinLight2 = Pin(13, Pin.OUT)

from machine import Pin
from machine import ADC

pinThermometer = ADC(0)      # Pino do termômetro (Só existe um analógico na ESP 8266)
pinLight1 = Pin(12, Pin.OUT) # Pino do LED 2
pinLight2 = Pin(13, Pin.OUT) # Pino do LED 1
socketPort = 6000            # Porta que a placa irá escutar no socket
serverHost = "192.168.43.244"  # IP do servidor NodeJS
serverPort = 5000            # Porta do servidor NodeJS
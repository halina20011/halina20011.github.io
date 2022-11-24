#include <TM1637Display.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const int oneWireBus = 4;
OneWire oneWire(oneWireBus);
DallasTemperature sensors(&oneWire);

const int CLK = 2;
const int DIO = 3;

TM1637Display display = TM1637Display(CLK, DIO);

const uint8_t celsiusSymbol[] = {
    SEG_A | SEG_B | SEG_F | SEG_G,
    SEG_A | SEG_D | SEG_E | SEG_F
};

void setup(){
    Serial.begin(115200);
    display.clear();
    display.setBrightness(7);
    sensors.begin();
}

void printTemperature(){
    sensors.requestTemperatures();
    float measuredTemperature = sensors.getTempCByIndex(0);
    Serial.println(String(measuredTemperature) + "°C");
    display.showNumberDec(measuredTemperature , false, 2, 0);
    display.setSegments(celsiusSymbol, 2, 2);
}

void loop(){
    printTemperature();
    delay(200);
}
#include <HC-SR04.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>

#define echoPin 2
#define trigPin 3

LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);
HCSR04 hc(echoPin, trigPin);

void setup(){
    Serial.begin(115200);
    lcd.begin(16,2);
    lcd.backlight();
    lcd.clear();
}

void loop(){
    lcd.setCursor(0, 0);
    lcd.print(hc.distance());
    Serial.println(hc.distance());
    lcd.setCursor(14, 0);
    lcd.print("mm");
    lcd.setCursor(0, 1);
    lcd.print(hc.distanceInch());
    lcd.setCursor(12, 1);
    lcd.print("inch");
    delay(200);
}
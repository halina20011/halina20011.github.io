#include "SegmentDisplay.h"

int digit1 = 6;
int digit2 = 9;
int digit3 = 10;
int digit4 = 11;

int segA = 2;
int segB = 3;
int segC = 4;
int segD = 5;
int segE = A0;
int segF = 7;
int segG = 8;

int dp = 12;

SEGMENT segment = SEGMENT(segA, segB, segC, segD, segE, segF, segG, dp);
SEGMENTDISPLAY sh = SEGMENTDISPLAY(4, segment, 0, digit1, digit2, digit3, digit4);

unsigned long currentMillis = 0;
unsigned long lastChange = 0;
const long interval = 1000;

int i = 0;

void setup(){
}

void loop(){
    sh.showInt(i);
    currentMillis = millis();
    
    if(interval <= currentMillis - lastChange){
        lastChange = currentMillis;
        i++;
    }
}

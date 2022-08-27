int led = 11;
int delayTime = 100;

void setup(){
    pinMode(led, OUTPUT);
}

void loop(){
    digitalWrite(led, HIGH);
    delay(delayTime);
    digitalWrite(led, LOW);
    delay(delayTime);
}
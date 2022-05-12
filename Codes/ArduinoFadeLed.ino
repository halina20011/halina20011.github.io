int led = 11;

void setup() {
    Serial.begin(9600);
    pinMode(led, OUTPUT);
}

void loop() {
    fade(led, 2);
    unfade(led, 2);
}

void fade(int Led, float time){
    time = time / 255 * 1000;
    for(int i = 0; i < 255; i++){
        analogWrite(Led, i);
        delay(time);
    }
}

void unfade(int Led, float time){
    time = time / 255 * 1000;
    for(int i = 255; i > 0; i--){
        analogWrite(Led, i);
        delay(time);
    }
}

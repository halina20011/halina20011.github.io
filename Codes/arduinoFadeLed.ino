int led = 11;
int brightness = 0;
int fadeAmount = 5;

int period = 1000;
int _delay = (period / 2) / (255 / fadeAmount);
long int lastF = 0;

void fade(){
    long int t = millis();
    if(t > lastF + _delay){
        lastF = t;
        
        analogWrite(led, brightness);
        brightness = brightness + fadeAmount;

        if(brightness <= 0 || brightness >= 255) {
            fadeAmount = -fadeAmount;
        }
    }
}

void setup(){
    pinMode(led, OUTPUT);
}

void loop(){
    fade();
}
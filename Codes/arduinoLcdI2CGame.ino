// ---------------------------------------------------------------
// Creted by Halina on 04.02.2022
// Source: https://halina20011.github.io/Arduino/arduinoLcdI2CGame.html 
// ---------------------------------------------------------------

#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Set the LCD address to 0x27
LiquidCrystal_I2C lcd(0x27, 2, 1, 0, 4, 5, 6, 7, 3, POSITIVE);

#define button 7
int lastButtonVal = 0;
bool character = 0;

bool status = 1;
bool ended = 0;

byte characterSymbol[8] = {
    0b01000,
    0b00100,
    0b00010,
    0b00001,
    0b00010,
    0b00100,
    0b01000
};

uint8_t blockUp[8] = {0xE, 0xE, 0xE, 0xE, 0xE, 0xE, 0x1F};
uint8_t blockDown[8] = {0x1F, 0xE, 0xE, 0xE, 0xE, 0xE, 0xE};
uint8_t clear[8] = {0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0};

// 0 = empty
// 1 = first
// 2 = second 
int object[20] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

float speed;
const float startSpeed = 600;
const float stopSpeed = 350;
const float speedAcceleration = 5;
unsigned long timer = 0; 
unsigned long lastDraw = 0; 

void setup(){
    Serial.begin(115200);
    pinMode(button, INPUT_PULLUP);

    randomSeed(analogRead(0));

    lcd.begin(16, 2);
    lcd.backlight();

    lcd.createChar(0, characterSymbol);
    lcd.createChar(1, blockUp);
    lcd.createChar(2, blockDown);
    lcd.createChar(3, clear);
   
    speed = startSpeed;
    generateTerrain();
    // printTerrain();
    drawGame();
}

void printTerrain(){
    Serial.println("----------------");
    for(int r = 1; r < 3; r++){
        for(int i = 0; i < 16; i++){
            if(object[i] == r){
                Serial.print("A");
            } 
            else{
                Serial.print("_");
            }
        }
        Serial.println();
    }
    Serial.println("----------------");
}

int generateBlock(int depth, int index){
    int block = 0;
    int none = 0;
    int changed = 0;
    
    // Calculating some statistics
    for(int d = (index - depth); d < index; d++){
        if(object[d] == 0){
            none++;
        }
        else if(block == 0){
            block = object[d];
        }
        else if(block != object[d]){
            changed = 1;
        }
    }

    if(changed == 0 && none == 0 && object[index - 1] == 0){
        // 1 - 1 ! + 1 = 0 ! + 1 = 1 + 1 = 2
        // 2 - 1 ! + 1 = 1 ! + 1 = 0 + 1 = 1
        int r = (!(block - 1)) + 1;
        // Serial.println(String(block) + " => " + String(r));
        return r;
    }
    if(changed == 0 && object[index - 1] == 0){
        return random(2) + 1;
    }
    if(object[index - 1] == 0){
        return random(3);
    }

    return 0;
}

void clearUpTerrain(){
    if(object[16] == object[18] && object[17] == 0){
        object[17] = object[16];
    }
}

void generateTerrain(){
    int chanage = false;
    Serial.println("-------------------------");
    for(int i = 0; i < 20; i++){
        if(i <= 4){
            object[i] = 0;
        }
        else{
            int result = generateBlock(4, i);
            Serial.println(String(i) + " Generated block " + String(result));
            object[i] = result;
        }
    }

    clearUpTerrain();
}

void drawGame(){
    lcd.clear();
    // printTerrain();
    drawCharacter();

    for(int r = 1; r < 3; r++){
        for(int i = 0; i < 16; i++){
            lcd.setCursor(i, r - 1);
            if(object[i] == r){
                lcd.write(char(r));
            } 
        }
    }
}

int nextStep(){
    // [a, b, c];
    // b is stores to last
    // b = c

    int newBlock = generateBlock(5, 20);
    int thisV;
    int lastV = object[19];

    for(int i = 19; i > 0; i--){
        thisV = lastV;
        lastV = object[i - 1];
        object[i - 1] = thisV;
        thisV = lastV;
    }

    object[19] = newBlock;
    clearUpTerrain();

    if(character + 1 == object[0]){
        Serial.print("End :3");
        return 0;
    }

    return 1;
}

void drawCharacter(){
    lcd.setCursor(0, int(!character));
    lcd.write(char(3));
    lcd.setCursor(0, int(character));
    lcd.write(char(0));
}

void loop(){
    int buttonVal = digitalRead(button);
    if(buttonVal == 0 && buttonVal != lastButtonVal){
        Serial.println(buttonVal);
        if(ended == 1){
            generateTerrain();
            ended = 0;
            status = 1;
            speed = startSpeed;
        }
        else{
            character = !character; 
            drawCharacter();
        }
    }
    lastButtonVal = buttonVal;

    if(status == 1){
        timer = millis();

        if(lastDraw + speed < timer){
            status = nextStep();
            drawGame();
            lastDraw = timer;
            if(stopSpeed < speed){
                speed -= speedAcceleration;
            }
        }
    }
    else if(status == 0 && !ended){
        lcd.clear();
        lcd.setCursor(5, 0);
        lcd.print("END :3");
        ended = 1;
    }
}

// sketch.js - Massive code file for running the Yamabocchi.
// Author: Dominic Berardi, Ryan Hueckel, Justin Hu, Autumn Plaxco, Elizabeth Arnold
// Date: 3/19/2023

// global variables
let bg;
let VIEWPORTSIZE = 400;
let money;
let startingMoney = 100;
let eventProbability = 10; // PERCENT CHANCE OF EVENT HAPPENING EVERY FIXED UPDATE
let decrementStatProbability = 55; // PERCENT CHANCE OF STAT DECREMENTING EVERY FIXEDUPDATE()
let increaseMoneyProbability = 50; // PERCENT CHANCE OF GETTING EXTRA MONEY EACH FIXED UPDATE
let fixedUpdateFrequency = 2; //fixedUpdate happens every x seconds
let fixedUpdateTimer = 0; //tracking time to check if fixedUpdate should happen
let startButton;
let startButtonPressed = false;
let restartButton;

// game objects
let creature;
let creatureSprite;
let img;
let hungerBar, funBar, healthBar;
let feedButton, toyButton, vetButton;

// assets
let music;
let music_speed = 1;
let crowdVolume = 0;
let buttonSFX, screenSFX, eatSFX, toySFX, vetSFX, noMoneySFX, getMoneySFX, crowdSFX;
let titleFont;
let wordsFont;
// arrays of images/sprites
let heads = [];
let bodies = [];
let legs = [];
let spriteArray = [];

// arrays of text
let textArray = [];
let happyText = [];
let neutralText = [];
let angryText = [];

// preload() to load all images
function preload() {

    heads.push(loadImage("assets/head_cassowary.png"));
    heads.push(loadImage("assets/head_jerboa.png"));
    heads.push(loadImage("assets/head_kangaroo.png"));

    bodies.push(loadImage("assets/body_cassowary.png"));
    bodies.push(loadImage("assets/body_jerboa.png"));
    bodies.push(loadImage("assets/body_kangaroo.png"));

    legs.push(loadImage("assets/legs_cassowary.png"));
    legs.push(loadImage("assets/legs_jerboa.png"));
    legs.push(loadImage("assets/legs_kangaroo.png"));

    // load dialouge
    textArray = loadStrings('assets/dialouge.txt');

    // sound music/sfx
    music = loadSound("assets/music.mp3");
    music.setVolume(0.3);
    buttonSFX = loadSound("assets/Button Press.mp3");
    buttonSFX.setVolume(0.7);
    screenSFX = loadSound("assets/Screen Button Press.mp3");
    screenSFX.setVolume(0.3);
    eatSFX = loadSound("assets/Eat Sound.mp3");
    eatSFX.setVolume(0.3);
    toySFX = loadSound("assets/Toy Sound.mp3");
    toySFX.setVolume(0.3);
    vetSFX = loadSound("assets/Vet Sound.mp3");
    vetSFX.setVolume(0.3);
    noMoneySFX = loadSound("assets/Not Enough Money.mp3");
    noMoneySFX.setVolume(0.3);
    crowdSFX = loadSound("assets/crowd-noise.mp3");
    crowdSFX.setVolume(0);
    
    // load fonts
    titleFont = loadFont("assets/Komika_Hand.ttf");
    wordsFont = loadFont("assets/Geometry_Soft_Pro-Bold_N.otf");
}


// setup() function is called once when the program starts
function setup() {
    createCanvas(windowWidth, windowHeight);
    bg = loadImage("assets/backpack.jpg");
    money = startingMoney;
    
    startButton = new StartButton('Generate Pet!');
    restartButton = new StartButton('Generate Pet...?');

    // split up text array
    let j = 0;
    let y = 0;
    for (let i = 0; i < textArray.length; i += 1) {
        if (textArray[i] == '') {
            y = i + 1;
            i = textArray.length;
        }
        else {
            happyText[j] = textArray[i];
            j += 1;
        }
    }
    j = 0;
    for (let i = y; i < textArray.length; i += 1) {
        if (textArray[i] == '') {
            y = i + 1;
            i = textArray.length;
        }
        else {
            neutralText[j] = textArray[i];
            j += 1;
        }
    }
    j = 0;
    for (let i = y; i < textArray.length; i += 1) {
        if (textArray[i] == '') {
            y = i + 1;
            i = textArray.length;
        }
        else {
            angryText[j] = textArray[i];
            j += 1;
        }
    }

}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    //console.log(mouseX, mouseY);

    // STUFF DRAWN NO MATTER WHAT
    background(bg);

    //Canvas draw
    stroke(0);
    strokeWeight(2);
    radialGradient(width/2, height/2, 0, width/2, height/2, 500, color(158, 198, 255), color(37, 71, 120));
    beginShape();
    vertex((width / 2) - 350, (height / 2) + 50);
    bezierVertex((width / 2) - 400, (height / 2) + 550, (width / 2) + 400, (height / 2) + 550, (width / 2) + 350, (height / 2) + 50);
    bezierVertex((width / 2) + 300, (height / 2) - 600, (width / 2) - 300, (height / 2) - 600, (width / 2) - 350, (height / 2) + 50);
    endShape();
    noFill();
    fill("#d6f2d3");
    radialGradient(width/2, height/2, 0, width/2, height/2, 200, color(222, 255, 222), color(138, 191, 138));
    strokeWeight(3);
    square(width / 2 - (VIEWPORTSIZE / 2), height / 2 - (VIEWPORTSIZE / 2), VIEWPORTSIZE);
    fill("#f7f6cf");
    stroke(0);
    strokeWeight(2);
    radialGradient((width / 2) - 150, (height / 2) + 275, 0, (width / 2) - 150, (height / 2) + 275, 50, color(201, 192, 62), color(247, 239, 129));
    circle((width / 2) - 150, (height / 2) + 275, 100);
    radialGradient((width / 2), (height / 2) + 300, 0, (width / 2), (height / 2) + 300, 50, color(201, 192, 62), color(247, 239, 129));
    circle((width / 2), (height / 2) + 300, 100);
    radialGradient((width / 2) + 150, (height / 2) + 275, 0, (width / 2) + 150, (height / 2) + 275, 50, color(201, 192, 62), color(247, 239, 129));
    circle((width / 2) + 150, (height / 2) + 275, 100);
    fill(color(240, 140, 255));
    strokeWeight(5);
    textAlign(CENTER, CENTER);
    textSize(48);
    textFont(titleFont);
    text("YANABOCCHI", width / 2, (height / 2) - 250);
    textFont(wordsFont);
    noStroke();
    strokeWeight(3);
    
    // runs only after game starts
    if (startButtonPressed) {

        // audio stuff
        music.rate(music_speed);
        toySFX.rate(music_speed);
        eatSFX.rate(music_speed);
        vetSFX.rate(music_speed);
        
        // animate creature and display dialouge
        creature.draw();
        creature.statDialogue();

        // update and display status bars
        hungerBar.update();
        funBar.update();
        healthBar.update();
        hungerBar.draw();
        funBar.draw();
        healthBar.draw();

        // display buttons
        feedButton.draw();
        toyButton.draw();
        vetButton.draw();

        // money display
        let moneytxt = "$" + String(money);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        let x = (width / 2) - (VIEWPORTSIZE / 2) + 30;
        let y = (height / 2) + (VIEWPORTSIZE / 4) + 30;
        text(moneytxt, x, y);

        // fixed update function for increasing money and decreasing creature stats
        fixedUpdateTimer += deltaTime / 1000;
        if (fixedUpdateTimer > fixedUpdateFrequency){
            fixedUpdate();
            fixedUpdateTimer = 0;
        }  
        if (creature.statArray[0] == 0 && creature.statArray[1] == 0 && creature.statArray[2] == 0){
            creature.isAlive = false;
            restartButton.draw();
            // reset music
            music.stop();
            if (!crowdSFX.isPlaying()){
                crowdSFX.loop(); 
            }
            if (crowdVolume < .35){
                crowdVolume += .005;
                crowdSFX.setVolume(crowdVolume);
            }
            music_speed = 1;
        }
    }
    else {
        startButton.draw();
    }
    
}

function fixedUpdate(){ // Runs every fixedUpdateFrequency seconds, use for things that don't run every frame like in draw()
    if (creature.isAlive) {
        creature.fixedUpdate();
    }
    randomMoneyFixedUpdate();
}

function randomMoneyFixedUpdate(){
    // always get a small amount of money each fixed update
    money += 5;
    // chance to get extra money, decreases over time
    let rand = random(100);
    let increment = random([10, 15, 20, 25, 30]);
    if (rand < increaseMoneyProbability){
        money += increment;
    }
}

function keyPressed() {
    if (key == 'f') {
        feedButton.update();
    }
    if (key == 't') {
        toyButton.update();
    }
    if (key == 'v') {
        vetButton.update();
    }
}

function mouseWithinRect(x, y, width, height) {
    if ((mouseX > x) && (mouseX < x + width) && (mouseY > y) && (mouseY < y + height)) {
        return true;
    }
    else {
        return false;
    }
}

function mouseWithinCircle(x, y, radius) {
    let dist = sqrt(((mouseX - x) * (mouseX - x)) +((mouseY - y) * (mouseY - y)));
    if (radius > abs(dist)) {
        return true;
    }
    else {
        return false;
    }
}

// for all of the buttons
function mousePressed() {
    // start/restart button
    if (mouseWithinRect(startButton.x, startButton.y, startButton.width, startButton.height) && !startButtonPressed) {
        money = startingMoney;
        screenSFX.play();
        generateRandomCreature();
        startButtonPressed = true;
    }
    if (mouseWithinRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height) && !creature.isAlive) {
        location.reload();
    }
    // interact buttons
    if (startButtonPressed && mouseWithinCircle(feedButton.cx, feedButton.cy, 100)) {
        buttonSFX.play();
        feedButton.update();
    }
    if (startButtonPressed && mouseWithinCircle(toyButton.cx, toyButton.cy, 100)) {
        buttonSFX.play();
        toyButton.update();
    }
    if (startButtonPressed && mouseWithinCircle(vetButton.cx, vetButton.cy, 100)) {
        buttonSFX.play();
        vetButton.update();
    }
}

function generateRandomCreature() {
    //Reset sprite array
    spriteArray = [];
    
    //Randomly select body parts and store them in an array
    spriteArray.push(random(heads));
    spriteArray.push(random(bodies));
    spriteArray.push(random(legs));

    //Stacks the 3 images on top of eachother to create a new image
    let widest = max(spriteArray[0].width, spriteArray[1].width, spriteArray[2].width);
    creatureSprite = createImage(widest, (spriteArray[0].height + spriteArray[1].height + spriteArray[2].height) / 3);
    creatureSprite.set((widest - spriteArray[0].width) / 2, 0, spriteArray[0].get(0, 0, spriteArray[0].width, creatureSprite.height / 3));
    creatureSprite.set((widest - spriteArray[1].width) / 2, creatureSprite.height / 3, spriteArray[1].get(0, creatureSprite.height / 3, spriteArray[1].width, creatureSprite.height / 3));
    creatureSprite.set((widest - spriteArray[2].width) / 2, creatureSprite.height / (3/2), spriteArray[2].get(0, creatureSprite.height / (3/2), spriteArray[2].width, creatureSprite.height / 3));
    updatePixels();
    
    // setting up all the objects
    creature = new Creature(width / 2, height / 2, creatureSprite);
    hungerBar = new StatusBar("Hunger", 0, 0);
    funBar = new StatusBar("Fun", 0, 1);
    healthBar = new StatusBar("Health", 0, 2);;
    feedButton = new InteractButton('Feed', 200, 0, 5, 10, 'F');
    toyButton = new InteractButton('Toy', 200, 1, 10, 10, 'T');
    vetButton = new InteractButton('Vet', 200, 2, 15, 10, 'V');

    // playing music
    music.loop();
}

class Creature {
    constructor(x, y, sprite, maxStat = 100){
        this.x = x;
        this.y = y;
        this.statArray = []
        this.statArray[0] = 90; //HUNGER
        this.statArray[1] = 90; //FUN
        this.statArray[2] = 90; //HEALTH
        this.highStat = 80;
        this.showingDialogue = false;
        this.lowStat = 20;
        this.isAlive = true;
        this.happiness = (this.statArray[0] + this.statArray[1] + this.statArray[2]) / (this.maxStat * 3);
        this.prevHappiness = 0;

        this.wavinessX = 0;  // smaller number = fewer repetitions
        this.wavinessY = 0;
        this.periodX = 10;  // smaller number = more
        this.periodY = 10;
      
        //Movement stuff
        this.chanceTimer = 0;
        this.chanceTime = 4000; //Controls how often the random chance for the creatue to move occurs
        this.isMoving = false;  
        this.movingTimer = 0;   
        this.movingTime = 1800; //Controls how long the creature moves for
        this.moveUpdate = 10;   //Controls the rate at which the creatue is moved
        this.updateTimer = 0;
        this.moveSpeed = 3;     //Controls how fast the creature moves
        this.movingRight = false;
        
        //Dialogue Stuff
        this.dialogueTime = 2000;
        this.dialogueTimer = this.dialogueTime + 1;
        this.normalDialogueTime = 2000;
        this.textColor = 0;
        this.statDialogueFrequency = 12000;
        this.statDiaFreqTimer = 0;
        this.words = "a";
        this.prevWords = this.words;
        this.textHeight = height / 2;
        //temp

        this.sprite = sprite;
        this.originalSprite = sprite;
        this.maxStat = maxStat;
        this.facingRight = false;
    }

    fixedUpdate() { //CREATURE FIXED UPDATE, RUNS EVERY fixedUpdateFrequency SECONDS, called in global fixedUpdate()
        for (let i = 0; i < 3; i++){ //FOR EVERY STAT
            let rand = random(100);
            if (rand < decrementStatProbability){ //CHANCE TO DECREMENT THAT STAT
                //Decreases stats by a lot more if any stat is super low
                let decrementMultiplier = 1;
                if (min(this.statArray) <= 5) {
                    let decrement = int(random(15, 20));
                    this.decreaseStat(i, decrement * decrementMultiplier);
                }
                else {
                    let decrement = int(random(5, 10));
                    this.decreaseStat(i, decrement * decrementMultiplier);
                }              
            }

            if (this.statArray[i] > this.highStat){
                rand = random(100);
                if (rand < eventProbability){ //CHANCE TO RUN GOOD EVENT WHEN STAT IS > this.highStat
                    this.statEvent(i, true);
                }
            }

            if (this.statArray[i] > this.lowStat){
                rand = random(100);
                if (rand < eventProbability){ //CHANCE TO RUN BAD EVENT WHEN STAT IS < this.lowStat
                    this.statEvent(i, false);
                }
            }
        }
    }

    draw() { //CREATURE ANIMATION LOOP, moves the creature in short increments that randomly occur where the frequency is based on overall happiness

        this.happiness = (this.statArray[0] + this.statArray[1] + this.statArray[2]) / (this.maxStat * 3);

        music_speed = map(this.happiness, 0, 1, 0.55, 1.05);
        increaseMoneyProbability = map(this.happiness, 0, 1, 25, 50);

        this.wavinessX = (1 - this.happiness) * 15;
        this.wavinessY = (1 - this.happiness) * 15;

        if ((this.prevHappiness - (this.prevHappiness % .01)) != (this.happiness - (this.happiness % .01))){
            this.sprite = this.distort(this.originalSprite, this.wavinessX, this.wavinessY, this.periodX, this.periodY);
        }

        push();
        if (this.facingRight) {
            scale(-1, 1);
            image(this.sprite, -int((this.x - this.sprite.width / 2) + (this.sprite.width)), int(this.y - this.sprite.height / 2));
        }
        else {
            image(this.sprite, int(this.x - this.sprite.width / 2), int(this.y - this.sprite.height / 2));
        }     
        pop();

        if(!this.isAlive) {
            return;
        }

        this.happiness = (this.statArray[0] + this.statArray[1] + this.statArray[2]) / (this.maxStat * 3);
        
        //Checks if the creature should start moving, time between movements are somewhat random
        if (this.chanceTimer >= this.chanceTime) {
            if (!this.isMoving) {
                //resets timers with some randomness and sets other vars
                this.chanceTimer = random(this.chanceTime / 4);
                this.isMoving = true;
                this.movingTimer = random(this.movingTime / 2);
                
                let chance = random(0, 2);
                //Randomly picks whether the creature moves left or right
                if (chance < 1) {
                    this.movingRight = true;
                }
                else {
                    this.movingRight = false;
                }     
                return;
            }
        }
        else {
            if (!this.isMoving) {
                this.chanceTimer += deltaTime;
            }
        }

        //Moves the creature left and right on a fixed update cycle
        if (this.isMoving) {
            if (this.movingTimer >= this.movingTime) {
                this.isMoving = false;
                return;
            }
            this.movingTimer += deltaTime;

            //updates moveSpeed based on current happiness
            if (this.happiness < 0.33) {
                this.moveSpeed = 1;
            } else if (this.happiness < 0.66) {
                this.moveSpeed = 2;
            } else {
                this.moveSpeed = 3;
            }

            if (this.updateTimer >= this.moveUpdate) {
                this.updateTimer = 0;
                //Moves the creature right
                if (this.movingRight) {
                    this.facingRight = true;
                    //Checks if creature is near the right border (needs to start moving left)
                    if ((width / 2) + (VIEWPORTSIZE / 2) - (this.sprite.width) <= this.x) {
                        this.movingRight = false;
                        return;
                    }
                    else {
                        this.x += this.moveSpeed;
                    }
                }
                //Moves the create left
                else {
                    this.facingRight = false;
                    //Checks if creature is near the left border (needs to start moving right)
                    if ((width / 2) - (VIEWPORTSIZE / 2) + (this.sprite.width) >= this.x) {
                        this.movingRight = true;
                        return;
                    }
                    else {
                        this.x -= this.moveSpeed;
                    }
                }
            }
            //Increases the fixed update timer
            else {
                this.updateTimer += deltaTime;
            }
        }

        this.prevHappiness = this.happiness;
        
    }


    distort(input, wavinessX, wavinessY, periodX, periodY) {
        let output = createImage(input.width, input.height);
        input.loadPixels();
        output.loadPixels();
        for (let y=0; y<input.height; y++) {
          for (let x=0; x<input.width; x++) {      
            
            // this formula is where the magic happens!
            // we calculate new x/y position and grab pixels
            // from the source image at that location
            let tempX = x + wavinessX * sin(x/periodX);
            let tempY = y + wavinessY * sin(y/periodY);
            let px = input.get(tempX, tempY);
            
            // then put those colors into the output
            // image at the regular x/y position
            output.set(x,y, px);
          }
        }
        output.updatePixels();
        return output;
    }

    startDialogue(text, duration){
        if(!this.isAlive || this.showingDialogue) {
            return;
        }
        this.showingDialogue = true;
        this.dialogueTimer = 0;
        this.words = text;
        this.prevWords = this.words;
        this.dialogueTime = duration;
        this.textHeight = this.y;
        let randomizer = random(1) < 0.5 ? -1 : 1;
        this.textHeight += (int(random(this.sprite.height / 3)) * randomizer) - int(this.sprite.height / 4);
    }

    statDialogue() {
        //Checks if dialogue should now be display
        if (this.statDiaFreqTimer > this.statDialogueFrequency) {
            //Reset timers
            this.statDiaFreqTimer = random(this.statDialogueFrequency / 3);
            // this.dialogueTimer = 0;

            //Generate random height for the text to be displayed at
            // this.textHeight = this.y;
            // let randomizer = random(1) < 0.5 ? -1 : 1;
            // this.textHeight += (int(random(this.sprite.height / 3)) * randomizer) - int(this.sprite.height / 4);

            //Generates text based on current overall happiness
            if (this.happiness < 0.33) {
                //Makes sure it doesn't say the same phrase twice in a row
                while (this.words == this.prevWords) {
                    this.words = random(angryText);
                }                  
            } else if (this.happiness < 0.66) {
                while (this.words == this.prevWords) {
                    this.words = random(neutralText);
                }
            } else {
                while (this.words == this.prevWords) {
                    this.words = random(happyText);
                }
            }
            this.startDialogue(this.words, this.normalDialogueTime);
        }
        //Increments timer for when dialogue should next be displayed

        this.statDiaFreqTimer += deltaTime;
        this.showDialogue(this.words); 
    }
  
    

    showDialogue(textToShow){     
        if(!this.isAlive || !this.showingDialogue) {
            return;
        }      
        // Checks whether the dialogue should be on the left or right of the creature
        let offset = this.x;        
        if (offset > width / 2) { //Show on left
            textAlign(RIGHT, TOP);
            fill(this.textColor);
            noStroke();
            textSize(15);
            if (this.facingRight) {
                text(textToShow, int(this.x - (this.sprite.width / 2) - ((VIEWPORTSIZE - this.sprite.width) / 2)), this.textHeight, int((VIEWPORTSIZE - this.sprite.width) / 2)); 
            }
            else {
                text(textToShow, int(this.x - (this.sprite.width / 2) - ((VIEWPORTSIZE - this.sprite.width) / 2)), this.textHeight, int((VIEWPORTSIZE - this.sprite.width) / 2)); 
            }
            
        }
        else { //Show on right
            textAlign(LEFT, TOP);
            fill(this.textColor);
            noStroke();
            textSize(15);
            if (this.facingRight) {
                text(textToShow, this.x + int(this.sprite.width / 2), this.textHeight, int((VIEWPORTSIZE - this.sprite.width) / 2));      
            }
            else {
                text(textToShow, this.x + int(this.sprite.width / 2), this.textHeight, int((VIEWPORTSIZE - this.sprite.width) / 2));      
            }             
        }
        if (this.showingDialogue){
            this.dialogueTimer += deltaTime;
        }
        
        if (this.dialogueTimer > this.dialogueTime){
            this.showingDialogue = false;
            this.dialogueTimer = 0;
        }
    }
    
    increaseStat(statIndex, increment, cost) {
        money -= cost;
        let stat = this.statArray[statIndex];
        this.statArray[statIndex] += increment;
        if (this.statArray[statIndex] > this.maxStat) {
            this.statArray[statIndex] = this.maxStat; // ensure it doesnt go over max stat
        }
        if (random(1) < .6 || this.showingDialogue){
            return;
        }
        switch (statIndex){
            case 0: // HUNGER
                if (stat > 66){
                    this.startDialogue("Yum!", 600);
                }
                else if (stat > 33){
                    this.startDialogue("I'm still hungry...", 900);
                }
                else {
                    this.startDialogue("MORE!", 600);
                }
                break;
                
            case 1: // FUN
                //PLACEHOLDER
                if (stat > 66){
                    this.startDialogue("I'm having a blast!", 900);
                }
                else if (stat > 33){
                    this.startDialogue("Can I get a new toy?", 900);
                }
                else {
                    this.startDialogue("Meh...", 600);
                }
                break;

            case 2: // HEALTH
                //PLACEHOLDER
                if (stat > 66){
                    this.startDialogue("I feel real healthy now!", 900);
                }
                else if (stat > 33){
                    this.startDialogue("Thanks for the vet trip!", 900);
                }
                else {
                    this.startDialogue("I'm still not feeling great.", 900);
                }
                break;
            default:
                print("statEvent(): INVALID STAT INDEX");
                break;
        }
    }

    decreaseStat(statIndex, increment){
        this.statArray[statIndex] -= increment;
        if (this.statArray[statIndex] < 0){
            this.statArray[statIndex] = 0;
        }
    }

    statEvent(statIndex, goodEvent){ //event that happens when stat is high or low. high = good event, low = bad event
        switch (statIndex){
            case 0: // HUNGER
                //PLACEHOLDER
                break;
                
            case 1: // FUN
                //PLACEHOLDER
                break;

            case 2: // HEALTH
                //PLACEHOLDER
                break;
            default:
                print("statEvent(): INVALID STAT INDEX")
        }
    }
}

class StatusBar {
    constructor(status, color, statIndex) {
        this.text = status; // text to display
        this.color = color; // color of the fill for the bar
        let offset = 10; // the amount of space between each bar (can be altered)
        this.barWidth = (VIEWPORTSIZE - (4 * offset)) / 3;
        this.barHeight = 20;
        this.x = offset + ((width / 2) - (VIEWPORTSIZE / 2)) + (offset * statIndex) + (this.barWidth * statIndex);
        this.y = offset + ((height / 2) - (VIEWPORTSIZE / 2));
        this.statIndex = statIndex;
        this.value = creature.statArray[this.statIndex];
    }

    update() {
        // update the stat so that it matches the updated stat of the creature
        this.value = creature.statArray[this.statIndex];
    }

    draw() {
        // draw the status bar in the correct location on the screen with the correct fill
        noStroke();
        fill(this.color);
        let percentage = (this.value / creature.maxStat)
        rect(this.x, this.y, (this.barWidth * percentage), this.barHeight);
        noFill();
        stroke(0);
        strokeWeight(1.5);
        rect(this.x, this.y, this.barWidth, this.barHeight);
        fill(0);
        noStroke();
        textSize(15);
        textAlign(CENTER, CENTER);
        text(this.text, this.x + (this.barWidth / 2), this.y + this.barHeight + 8);
    }
}

class StartButton {
    constructor(text) {
        this.width = 120;
        this.height = 40;
        this.x = (width / 2) - (this.width / 2);
        this.y = (height / 2) - (this.height / 2);
        this.text = text;
    }

    draw() {
        //noFill();
        fill(100, 100, 100, 80);
        stroke(0);
        strokeWeight(1.5);
        rect(this.x, this.y, this.width, this.height);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(15);
        text(this.text, this.x + (this.width / 2), this.y + (this.height / 2));
    }
}

class InteractButton {
    constructor(interaction, color, statIndex, initialCost, initialEffect, key) {
        this.text = interaction;
        this.key = key;
        this.color = color;
        this.statIndex = statIndex;
        let offset = 10;
        // for on screen display
        this.buttonWidth = (VIEWPORTSIZE - (4 * offset)) / 3;
        this.buttonHeight = 40;
        this.x = offset + ((width / 2) - (VIEWPORTSIZE / 2)) + (offset * statIndex) + (this.buttonWidth * statIndex);
        this.y = ((height / 2) - (VIEWPORTSIZE / 2)) + VIEWPORTSIZE - this.buttonHeight - offset;
        this.cost = initialCost;
        this.effect = initialEffect;
        this.timesPressed = 0; // used to decrease the effectivness of interaction and increase the cost of interaction
        // for circle buttons
        this.cx = 0;
        this.cy = 0;
        if (statIndex == 0) {
            this.cx = (width / 2) - 150;
            this.cy = (height / 2) + 275;
        }
        if (statIndex == 1) {
            this.cx = (width / 2);
            this.cy = (height / 2) + 300;
        }
        if (statIndex == 2) {
            this.cx = (width / 2) + 150;
            this.cy = (height / 2) + 275;
        }
    }

    // gets called when certain key or the mouse is pressed
    update() {
        if (money < this.cost){
            noMoneySFX.play();
            return;
        }
        if (creature.isAlive && money >= this.cost && creature.statArray[this.statIndex] < creature.maxStat) {
            creature.increaseStat(this.statIndex, this.effect, this.cost);
            if (this.statIndex == 0) {
                eatSFX.play();
            } 
            else if (this.statIndex == 1) {
                toySFX.play();
            }
            else if (this.statIndex == 2) {
                vetSFX.play();
            }
            this.timesPressed += 1;
            // deals with increasing cost / decreasing effect
            if ((this.timesPressed != 0) && (this.timesPressed % 5) == 0) {
                this.cost += 5;
                this.effect -= 1; 
                if (this.effect < 0) {
                    this.effect = 1; // makes sure the effect never becomes 0
                }
            }
        }
    }

    draw() {
        noFill();
        stroke(0);
        strokeWeight(1.5);
        rect(this.x, this.y, this.buttonWidth, this.buttonHeight);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(15);
        let display = this.text + "   $" + String(this.cost) + "   [" + this.key + "]";
        text(display, this.x + (this.buttonWidth / 2), this.y + (this.buttonHeight / 2));
    }
}

function radialGradient(sX, sY, sR, eX, eY, eR, sColor, eColor){
    let gradient = drawingContext.createRadialGradient(sX, sY, sR, eX, eY, eR);
    gradient.addColorStop(0, sColor);
    gradient.addColorStop(1, eColor);
    drawingContext.fillStyle = gradient;
}
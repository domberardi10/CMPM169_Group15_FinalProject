// sketch.js - purpose and description here
// Author: Your Name
// Date:

// global variables
let VIEWPORTSIZE = 400;
let money;
let startingMoney = 100;
let eventProbability = 10; // PERCENT CHANCE OF EVENT HAPPENING EVERY FIXED UPDATE
let decrementStatProbability = 45; // PERCENT CHANCE OF STAT DECREMENTING EVERY FIXEDUPDATE()
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

// arrays of images/sprites
let heads = [];
let bodies = [];
let legs = [];
let spriteArray = [];

let textArray = [];
let happyText = [];
let neutralText = [];
let angryText = [];

// preload() to load all images
function preload() {
    //var folder = "assets/";

    heads.push(loadImage("assets/head_test_yellow.PNG"));
    heads.push(loadImage("assets/head_test_blue.PNG"));
    heads.push(loadImage("assets/head_test_red.PNG"));
    bodies.push(loadImage("assets/body_test_blue.PNG"));
    bodies.push(loadImage("assets/body_test_yellow.PNG"));
    bodies.push(loadImage("assets/body_test_red.PNG"));
    legs.push(loadImage("assets/legs_test_red.PNG"));
    legs.push(loadImage("assets/legs_test_blue.PNG"));
    legs.push(loadImage("assets/legs_test_yellow.PNG"));

    // $.ajax({
    //     url : folder,
    //     success: function (data) {
    //         $(data).find("a").attr("href", function (i, val) {
    //             if( val.match(/\.(PNG.preview)$/) ) { 
    //                 img = loadImage(val.split(".pre")[0]);
    //                 let val_copy = val;
    //                 let val_body_part = val_copy.split("_test")[0];
    //                 if (val_body_part.split("/assets/").pop() == "head"){
    //                     heads.push(img);
    //                 }
    //                 else if (val_body_part.split("/assets/").pop() == "body"){
    //                     bodies.push(img);
    //                 }
    //                 else if (val_body_part.split("/assets/").pop() == "legs"){
    //                     legs.push(img);
    //                 }
    //             } 
    //         });
    //     }
    // });

    textArray = loadStrings('dialouge.txt');
}


// setup() function is called once when the program starts
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(225);
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

    setTimeout(() => {
        console.log(heads);
        console.log(bodies);
        console.log(legs);
        //generateRandomCreature();
    }, 100);

}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    //console.log(mouseX, mouseY);

    // STUFF DRAWN NO MATTER WHAT
    background("#f7f6cf"); 

    //Canvas draw
    stroke(0);
    strokeWeight(2);
    fill("#b6d8f2");
    beginShape();
    vertex((width / 2) - 350, (height / 2) + 50);
    bezierVertex((width / 2) - 400, (height / 2) + 550, (width / 2) + 400, (height / 2) + 550, (width / 2) + 350, (height / 2) + 50);
    bezierVertex((width / 2) + 300, (height / 2) - 600, (width / 2) - 300, (height / 2) - 600, (width / 2) - 350, (height / 2) + 50);
    // vertex((width / 2) - 350, (height / 2) + 300);
    // bezierVertex((width / 2) - 300, (height / 2) + 400, (width / 2) + 300, (height / 2) + 400, (width / 2) + 350, (height / 2) + 300);
    // bezierVertex((width / 2) + 550, (height / 2), (width / 2) + 250, (height / 2) - 400, (width / 2), (height / 2) - 400);
    // bezierVertex((width / 2) - 250, (height / 2) - 400, (width / 2) - 550, (height / 2), (width / 2) - 350, (height / 2) + 300);
    endShape();
    //ellipse(width / 2, height / 2, 600, 800);
    noFill();
    fill("#ffffff");
    strokeWeight(3);
    square(width / 2 - (VIEWPORTSIZE / 2), height / 2 - (VIEWPORTSIZE / 2), VIEWPORTSIZE);
    fill("#C1E1C1");
    stroke(0);
    strokeWeight(2);
    circle((width / 2) - 150, (height / 2) + 275, 100);
    circle((width / 2), (height / 2) + 300, 100);
    circle((width / 2) + 150, (height / 2) + 275, 100);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(48);
    text("YANABOCCHI", width / 2, (height / 2) - 250);
    noStroke();
    strokeWeight(3);
    
    // runs only after game starts
    if (startButtonPressed) {

        // animate creature and display dialouge
        creature.draw();
        creature.dialogue();
        //image(creatureSprite, mouseX - creatureSprite.width / 2, mouseY - creatureSprite.height / 2);

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
    let rand = random(100);
    let chance = 35;
    let increment = int(random(25, 50));
    if (rand < chance){
        console.log("Have some money :) ");
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
        generateRandomCreature();
        startButtonPressed = true;
    }
    if (mouseWithinRect(restartButton.x, restartButton.y, restartButton.width, restartButton.height) && !creature.isAlive) {
        money = startingMoney;
        generateRandomCreature();
    }
    // interact buttons
    if (startButtonPressed && mouseWithinCircle(feedButton.cx, feedButton.cy, 100)) {
        feedButton.update();
    }
    if (startButtonPressed && mouseWithinCircle(toyButton.cx, toyButton.cy, 100)) {
        toyButton.update();
    }
    if (startButtonPressed && mouseWithinCircle(vetButton.cx, vetButton.cy, 100)) {
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
    creatureSprite = createImage(widest, spriteArray[0].height + spriteArray[1].height + spriteArray[2].height);
    creatureSprite.set((widest - spriteArray[0].width) / 2, 0, spriteArray[0]);
    creatureSprite.set((widest - spriteArray[1].width) / 2, spriteArray[0].height, spriteArray[1]);
    creatureSprite.set((widest - spriteArray[2].width) / 2, spriteArray[0].height + spriteArray[1].height, spriteArray[2]);
    updatePixels();
    
    // setting up all the objects
    creature = new Creature(width / 2, height / 2, creatureSprite);
    hungerBar = new StatusBar("Hunger", 100, 0);
    funBar = new StatusBar("Fun", 100, 1);
    healthBar = new StatusBar("Health", 100, 2);;
    feedButton = new InteractButton('Feed', 200, 0, 5, 10, 'F');
    toyButton = new InteractButton('Toy', 200, 1, 10, 10, 'T');
    vetButton = new InteractButton('Vet', 200, 2, 15, 10, 'V');
}

class Creature {
    constructor(x, y, sprite, maxStat = 100){
        this.x = x;
        this.y = y;
        this.statArray = []
        this.statArray[0] = 60; //HUNGER
        this.statArray[1] = 60; //FUN
        this.statArray[2] = 60; //HEALTH
        this.highStat = 80;
        this.lowStat = 20;
        this.isAlive = true;
        this.happiness = (this.statArray[0] + this.statArray[1] + this.statArray[2]) / (this.maxStat * 3)
      
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
        this.textColor = 0;
        this.statDialogueFrequency = 10000;
        this.statDiaFreqTimer = 0;
        this.words = "a";
        this.prevWords = this.words;
        this.textHeight = height / 2;
        //temp

        this.sprite = sprite;
        this.maxStat = maxStat;
    }

    fixedUpdate() { //CREATURE FIXED UPDATE, RUNS EVERY fixedUpdateFrequency SECONDS, called in global fixedUpdate()
        for (let i = 0; i < 3; i++){ //FOR EVERY STAT
            let rand = random(100);
            if (rand < decrementStatProbability){ //CHANCE TO DECREMENT THAT STAT
                //Decreases stats by a lot more if any stat is super low
                if (min(this.statArray) <= 5) {
                    this.decreaseStat(i, 15);
                }
                else {
                    this.decreaseStat(i, 5);
                }              
                //print("random decrease")
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
        image(this.sprite, this.x - this.sprite.width / 2, this.y - this.sprite.height / 2);

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

        // Distort the sprite with noise
        // this.sprite.loadPixels();
        // for (let i = 0; i < (this.sprite.width * this.sprite.height); i++){
        //     this.sprite.pixels[i] = noise(1 - this.happiness);
        // }
        // this.sprite.updatePixels();
    }

    statDialogue(){

    }

    dialogue() {
        if(!this.isAlive) {
            return;
        }
        //Checks if dialogue isn't currently being displayed
        if (this.dialogueTimer > this.dialogueTime) {
            //Checks if dialogue should now be display
            if (this.statDiaFreqTimer > this.statDialogueFrequency) {
                //Reset timers
                this.statDiaFreqTimer = random(this.statDialogueFrequency / 3);
                this.dialogueTimer = 0;

                //Generate random height for the text to be displayed at
                this.textHeight = this.y;
                let randomizer = random(1) < 0.5 ? -1 : 1;
                this.textHeight += int(random(this.sprite.height / 4)) * randomizer;

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
                this.prevWords = this.words;
            }
            //Increments timer for when dialogue should next be displayed
            else {
                this.statDiaFreqTimer += deltaTime;
            }
        }
        //Displays Text
        else {     
            this.showDialogue(this.words);
        }      
    }

    showDialogue(textToShow){           
        if (this.x > width / 2) {//Checks whether the dialogue should be on the left or right of the creature
            textAlign(RIGHT, TOP);
            fill(this.textColor);
            noStroke();
            textSize(15);
            text(textToShow, this.x - int(this.sprite.width / 1.5) - 150, this.textHeight, 150); 
        }
        else {
            textAlign(LEFT, TOP);
            fill(this.textColor);
            noStroke();
            textSize(15);
            text(textToShow, this.x + int(this.sprite.width / 1.5), this.textHeight, 150);        
        }
        this.dialogueTimer += deltaTime;
    }
    
    increaseStat(statIndex, increment, cost) {
        money -= cost;
        this.statArray[statIndex] += increment;
        if (this.statArray[statIndex] > this.maxStat) {
            this.statArray[statIndex] = this.maxStat; // ensure it doesnt go over max stat
        }
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

    decreaseStat(statIndex, increment){
        this.statArray[statIndex] -= increment;
        if (this.statArray[statIndex] < 0){
            this.statArray[statIndex] = 0;
        }
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
        text(this.text, this.x + (this.barWidth / 2), this.y + (this.barHeight / 2));
    }
}

class StartButton {
    constructor(text) {
        this.width = 120;
        this.height = 40;
        this.x = (width / 2) - (this.width / 2);
        this.y = (height / 2) - (this.height / 2);
        this.color = 200;
        this.text = text;
    }

    draw() {
        fill(this.color);
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
        this.timesPressed = 0; // used to decrease the effectivness of interaction or increase the cost of interaction?
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
            console.log("Not Enough Money") //replace with something thats not a print statement
            return;
        }
        if (creature.isAlive && money >= this.cost && creature.statArray[this.statIndex] < creature.maxStat) {
            creature.increaseStat(this.statIndex, this.effect, this.cost);
            this.timesPressed += 1;
            // deals with increasing cost / decreasing effect (not finished yet)
            // right now, all this does is increase the cost and decrease the effectiveness every 5 times it is used
            if ((this.timesPressed != 0) && (this.timesPressed % 5) == 0) {
                this.cost += 5;
                this.effect -= 1; 
                if (this.effect < 0) {
                    this.effect = 0.5; // makes sure the effect never becomes 0
                }
            }
        }
    }

    draw() {
        fill(this.color);
        stroke(0);
        strokeWeight(1.5);
        rect(this.x, this.y, this.buttonWidth, this.buttonHeight);
        fill(0);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(15);
        let display = this.text + "   $" + String(this.cost) + "   [" + this.key + "]";
        text(display, this.x + (this.buttonWidth / 2), this.y + (this.buttonHeight / 2));
        // circle buttons
        fill("#C1E1C1");
        stroke(0);
        strokeWeight(2);
        circle(this.cx, this.cy, 100);
    }
}


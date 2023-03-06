// sketch.js - purpose and description here
// Author: Your Name
// Date:

// global variables
let VIEWPORTSIZE = 400;
let money;
let startStat = 50;
let startingMoney = 100;
let eventProbability = 10; // PERCENT CHANCE OF EVENT HAPPENING EVERY FIXED UPDATE
let decrementStatProbability = 5; // PERCENT CHANCE OF STAT DECREMENTING EVERY FIXEDUPDATE()
let fixedUpdateFrequency = 3; //fixedUpdate happens every x seconds
let fixedUpdateTimer = 0; //tracking time to check if fixedUpdate should happen

let creature;
let creatureSprite;
let img;
let hungerBar, funBar, healthBar;
let feedButton, toyButton, vetButton;

// arrays of images/sprites
let heads = [];
let bodies = [];
let legs = [];

let testy;

let spriteArray = [];

// preload() to load all images
function preload() {
    var folder = "assets/";

    heads.push(loadImage("assets/head_test_yellow.PNG"));
    bodies.push(loadImage("assets/body_test_blue.PNG"));
    legs.push(loadImage("assets/legs_test_red.PNG"));

    $.ajax({
        url : folder,
        success: function (data) {
            $(data).find("a").attr("href", function (i, val) {
                //console.log(val);
                if( val.match(/\.(PNG.preview)$/) ) { 
                    //val.replace(".preview", "");
                    //val.split(".pre")[0];
                    //console.log(val.split(".pre")[0]);
                    img = loadImage(val.split(".pre")[0]);
                    let val_copy = val;
                    let val_body_part = val_copy.split("_test")[0];
                    //console.log(val_body_part.split("/assets/").pop());
                    if (val_body_part.split("/assets/").pop() == "head"){
                        heads.push(img);
                    }
                    else if (val_body_part.split("/assets/").pop() == "body"){
                        bodies.push(img);
                    }
                    else if (val_body_part.split("/assets/").pop() == "legs"){
                        legs.push(img);
                    }
                } 
            });
        }
    });
}


// setup() function is called once when the program starts
function setup() {
    createCanvas(windowWidth, windowHeight);
    background(225);
    money = startingMoney;

    // testing status bar display
    generateRandomCreature();
    creature = new Creature(width / 2, height / 2, creatureSprite);
    hungerBar = new StatusBar("Hunger", 100, 0);
    funBar = new StatusBar("Fun", 100, 1);
    healthBar = new StatusBar("Health", 100, 2);;

    // testing interaction button display
    feedButton = new InteractButton('Feed', 200, 0, 5, 10, 'F');
    toyButton = new InteractButton('Toy', 200, 1, 10, 10, 'T');
    vetButton = new InteractButton('Vet', 200, 2, 15, 10, 'V');

    setTimeout(() => {
        console.log(heads);
        console.log(bodies);
        console.log(legs);
    }, 1000);
    

    // console.log(heads);
    // console.log(bodies);
    // console.log(legs);

}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
    background(220); 

    //Canvas draw
    noFill();
    stroke(0);
    strokeWeight(3);
    square(width / 2 - (VIEWPORTSIZE / 2), height / 2 - (VIEWPORTSIZE / 2), VIEWPORTSIZE);
    
    creature.draw();
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

    // testing money amount
    console.log('Money = $' + money);

    // temporary money display
    let txt = "$" + String(money);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    let x = (width / 2) - (VIEWPORTSIZE / 2) + 30;
    let y = (height / 2) + (VIEWPORTSIZE / 4) + 30;
    text(txt, x, y);


    fixedUpdateTimer += deltaTime / 1000;
    if (fixedUpdateTimer > fixedUpdateFrequency){
        fixedUpdate();
        fixedUpdateTimer = 0;
    }  
    
}

function fixedUpdate(){ // Runs every fixedUpdateFrequency seconds, use for things that don't run every frame like in draw()
    creature.fixedUpdate();
}

function keyPressed() {
    // code to run when key is pressed
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

function generateRandomCreature() {
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
}

class Creature {
    constructor(x, y, sprite, maxStat = 100){
        this.x = x;
        this.y = y;
        this.statArray = []
        this.statArray[0] = 50; //HUNGER
        this.statArray[1] = 50; //FUN
        this.statArray[2] = 50; //HEALTH
        this.highStat = 80;
        this.lowStat = 20;
      
        this.chanceTimer = 0;
        this.chanceTime = 2200; //Controls how often the random chance for the creatue to move occurs
        this.isMoving = false;  
        this.movingTimer = 0;   
        this.movingTime = 1000; //Controls how long the creature moves for
        this.moveUpdate = 10;   //Controls the rate at which the creatue is moved
        this.updateTimer = 0;
        this.moveSpeed = 3;     //Controls how fast the creature moves
        this.movingRight = false;

        this.sprite = sprite;
        this.maxStat = maxStat
    }

    fixedUpdate() { //CREATURE FIXED UPDATE, RUNS EVERY fixedUpdateFrequency SECONDS, called in global fixedUpdate()
        for (let i = 0; i < 3; i++){ //FOR EVERY STAT
            let rand = random(100);
            if (rand < decrementStatProbability){ //CHANCE TO DECREMENT THAT STAT
                this.decreaseStat(i, 5);
                print("random decrease")
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

        //Randomly decides when the creature should move on a fixed update cycle
        if (this.chanceTimer >= this.chanceTime) {
            if (!this.isMoving) {
                this.chanceTimer = 0;
                //Rolls a random chance based on the creatures current stats
                let chance = random(0, this.maxStat * 3);
                if (chance < this.statArray[0] + this.statArray[1] + this.statArray[2]) {
                    this.isMoving = true;
                    this.movingTimer = 0;
                    //Randomly picks whether the creature moves left or right
                    chance = random(0, 2);
                    if (chance < 1) {
                        this.movingRight = true;
                    }
                    else {
                        this.movingRight = false;
                    }
                }
                return;
            }
        }
        else {
            this.chanceTimer += deltaTime;
        }

        //Moves the creature left and right on a fixed update cycle
        if (this.isMoving) {
            if (this.movingTimer >= this.movingTime) {
                this.isMoving = false;
                return;
            }
            this.movingTimer += deltaTime;

            //updates moveSpeed based on current happiness
            let happiness = (this.statArray[0] + this.statArray[1] + this.statArray[2]) / (this.maxStat * 3);
            if (happiness < 0.33) {
                this.moveSpeed = 1;
            } else if (happiness < 0.66) {
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
    }
    
    increaseStat(statIndex, increment, cost){
        if (money < cost){
            console.log("Not Enough Money") //replace with something thats not a print statement
            return;
        }
        else if (this.statArray[statIndex] < this.maxStat) {
            money -= cost;
            this.statArray[statIndex] += increment;
            if (this.statArray[statIndex] > this.maxStat) {
                this.statArray[statIndex] = this.maxStat; // ensure it doesnt go over max stat
            }
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
        textAlign(CENTER, CENTER);
        text(this.text, this.x + (this.barWidth / 2), this.y + (this.barHeight / 2));
    }
}

class InteractButton {
    // might change these to button, in which case key isnt necessary
    constructor(interaction, color, statIndex, initialCost, initialEffect, key) {
        this.text = interaction;
        this.key = key;
        this.color = color;
        this.statIndex = statIndex;
        let offset = 10;
        this.buttonWidth = (VIEWPORTSIZE - (4 * offset)) / 3;
        this.buttonHeight = 40;
        this.x = offset + ((width / 2) - (VIEWPORTSIZE / 2)) + (offset * statIndex) + (this.buttonWidth * statIndex);
        this.y = ((height / 2) - (VIEWPORTSIZE / 2)) + VIEWPORTSIZE - this.buttonHeight - offset;
        this.cost = initialCost;
        this.effect = initialEffect;
        this.timesPressed = 0; // used to decrease the effectivness of interaction or increase the cost of interaction?
    }

    // gets called when certain key is pressed
    update() {
        if (money >= this.cost && creature.statArray[this.statIndex] < creature.maxStat) {
            creature.increaseStat(this.statIndex, this.effect, this.cost);
            this.timesPressed += 1;
            // deals with increasing cost / decreasing effect (not finished yet)
            // right now, all this does is increase the cost and decrease the effectiveness every 5 times it is used
            if ((this.timesPressed != 0) && (this.timesPressed % 5) == 0) {
                this.cost += 5;
                this.effect -= 1;
                if (this.effect < 0) {
                    this.effect = 1; // maybe we DO want to reach apoint where it becomes completely ineffective
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
    }
}
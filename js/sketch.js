// sketch.js - purpose and description here
// Author: Your Name
// Date:

// global variables
let VIEWPORTSIZE = 400;
let money;
let startStat = 50;
let startingMoney = 500;
let eventProbability = 10; // PERCENT CHANCE OF EVENT HAPPENING EVERY FIXED UPDATE
let decrementStatProbability = 15; // PERCENT CHANCE OF STAT DECREMENTING EVERY FIXEDUPDATE()
let fixedUpdateFrequency = 3; //fixedUpdate happens every x seconds
let fixedUpdateTimer = 0; //tracking time to check if fixedUpdate should happen

let creature;
let img;

// arrays of images/sprites
let heads = [];
let bodies = [];
let legs = [];

// preload() to load all images
function preload() {
    var folder = "assets/";

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
    money = startingMoney

    //Canvas draw
    noFill();
    stroke(0);
    strokeWeight(3);
    square(width / 2 - (VIEWPORTSIZE / 2), height / 2 - (VIEWPORTSIZE / 2), VIEWPORTSIZE);

    //let creature = Creature(width / 2, height / 2, SPRITE)

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
    //background(220); 
    
    //creature.draw();

    fixedUpdateTimer += deltaTime;
    if (fixedUpdateTimer > fixedUpdateFrequency){
        fixedUpdate();
        fixedUpdateTimer = 0;
    }  
    
}

function fixedUpdate(){ // Runs every fixedUpdateFrequency seconds, use for things that don't run every frame like in draw()
    //creature.fixedUpdate();

}



// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function generateRandomCreature() {
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

        this.sprite = sprite;
        this.maxStat = maxStat
    }

    fixedUpdate() { //CREATURE FIXED UPDATE, RUNS EVERY fixedUpdateFrequency SECONDS, called in global fixedUpdate()
        for (let i = 0; i < 3; i++){ //FOR EVERY STAT
            let rand = random(100);
            if (rand < decrementStatProbability){ //CHANCE TO DECREMENT THAT STAT
                this.decreaseStat(statIndex, 5);
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

    draw() { //CREATURE ANIMATION LOOP
    }

    increaseStat(statIndex, increment, cost){
        if (money < cost){
            print("YOU ARE POVERTY") //replace with something thats not a print statement
            return;
        }
        money -= cost;
        this.statArray[statIndex] += increment
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
        // 5 is used as the amount of space between each bar (can be altered)
        this.barWidth = (VIEWPORTSIZE - (4 * 5)) / 3;
        this.barHeight = 10;
        this.x = 5 + ((width / 2) - (VIEWPORTSIZE / 2)) + (5 + statIndex) + (barwidth * statIndex);
        this.y = 5 + ((height / 2) - (VIEWPORTSIZE / 2));
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
        fill(color);
        let percentage = (this.value / 100) // 100 is the max stat value here (might want to make that global)
        rect(this.x, this.y, (this.barWidth * percentage), this.barHeight);
        noFill();
        stroke(0);
        rect(this.x, this.y, this.barWidth, this.barHeight);
    }
}
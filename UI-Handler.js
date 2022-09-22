import * as GOS from './modules/gos-manager.js';

//UI elements will be handled by this object
GOS.createNode('root', 'UI', 3, [], class UI {
    constructor() {
        this.UIX;
        this.UIY;
        this.earned = '';
        this.game = true;
        this.moneySymbol;
        this.showGuide = true
    }


    setup() {
        this.UIX = windowWidth / 2;
        this.UIY = windowHeight - 30;
        this.moneySymbol = loadImage('./assets/money icon/Currency.png');
    }

    update() {
        if (this.game) {
            this.drawUI();
        } else {
            this.gameOver();
        }
    }

    drawUI() {
        this.UIBackground();
        this.UILatestCityList();
        this.UIMoneyCounter();
        this.UIguide();
    }

    UIBackground() {
        rectMode(CENTER);
        // Draw a rectangle with rounded corners,
        fill(100, 120, 100);
        rect(this.UIX, this.UIY, 800, 60, 20, 20, 0, 0);
    }

    UILatestCityList() {
        fill(200);
        rect(this.UIX + 250, this.UIY, 120, 60) // background for the citylist
        let last3Cities = [];
        last3Cities = GOS.get('cityManager').cities.slice(-3)
        fill(0);
        textSize(20)
        for (let i = 0; i < last3Cities.length; i++) {
            text(last3Cities[i].name, this.UIX + 200, this.UIY - 13 + 20 * i);

        }
    }

    UIMoneyCounter() {
        fill(100, 120, 100);
        rectMode(CORNER)
        fill(0);
        textSize(40);
        text(window.money + ' ' + this.earned, 30, 0, 1000, 80);
        image(this.moneySymbol, 3, 3,30,30)
    }
    
    UIguide(){
        if(this.showGuide == true){
            rectMode(CORNER);
            fill(100);
            rect(10,40,300,150);
            fill(0);
            textSize(20);
            text('Click on cities using spacebar to make new connections, hover over cities to see import/exports keep cities supplied',10,45,300,200)
            text('Click to hide',100,170);
        }
        if(mouseIsPressed && mouseX < 300  && mouseX > 10 && mouseY < 150  && mouseY > 40){
            this.showGuide = false;
        }
    }

    gameOver() {
        fill(100, 120, 100);
        rect(0,0,windowWidth,windowHeight);
        rectMode(CENTER);
        fill(0)
        textSize(100)
        text('GAME OVER', 400,400)
    }
})
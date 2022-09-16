import * as GOS from './modules/gos-manager.js';

//UI elements will be handled by this object
GOS.createNode('root', 'UI', 3, [], class Map {
    constructor() {
        this.UIX
        this.UIY
        this.earned = ''
        this.game = true
    }


    setup() {
        this.UIX = windowWidth / 2
        this.UIY = windowHeight - 30
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
        rect(0, 0, 20, 40);
        fill(0);
        textSize(40);
        text(window.money + ' ' + this.earned, 30, 0, 1000, 80);
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

/**
 * @module './modules/gos-manager.js'
 */
import * as GOS from './modules/gos-manager.js';

document.body.style.overflow = 'hidden';

window.money = 5000;



GOS.createNode('Root', 'Game', 0, [], class Game { 
  constructor() { } 
  update(){
    if(mouseX < 80){
        if(keyCode === SHIFT && keyIsPressed){
            this.Position.x+=8;}
            else { this.Position.x+=2;}
    } else if (mouseX > windowWidth-80){
        if(keyCode === SHIFT && keyIsPressed){
            this.Position.x-=8;}
            else { this.Position.x-=2;}
    }
    if (mouseY < 80){
        if(keyCode === SHIFT && keyIsPressed){
            this.Position.y+=8;}
            else { this.Position.y+=2;}
        
    } else if (mouseY > windowHeight-80){
        if(keyCode === SHIFT && keyIsPressed){
            this.Position.y-=8;}
            else { this.Position.y-=2;}
        }
    }
});
// GOS.createNode('Root', 'UI', 1, [], class UI { constructor() { } })

GOS.initialized.onEmit(() => {
  createCanvas(windowWidth,windowHeight);
  soundFormats('mp3');
});

GOS.get('Root').update = () => {
  background(182, 219, 246);
}

GOS.createGameObject('./cities/cityManager.js');
GOS.createGameObject('./road.js');
GOS.createGameObject('./mapHandler.js');
GOS.createGameObject('./UI-Handler.js');

//temp function for debuggin'
window.newC = function () {
  GOS.get('Game.CityManager').tryForCity();
}

window.mouseClicked = function () {
  const Game = GOS.get('Game')
  console.log(Game.Position.x,Game.Position.y)
}


window.GOS = GOS;

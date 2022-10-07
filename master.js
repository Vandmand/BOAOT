import * as GOS from './modules/gos-manager.js';
import * as GXY from './modules/GXY-manager.js';

document.body.style.overflow = 'hidden';

window.money = 5000;

GOS.createNode('Root', 'Game', 0, [], class Game { 
  constructor() { } 
  // update(){
  //   if(mouseX < 80){
  //       if(keyCode === SHIFT && keyIsPressed){
  //           this.x+=8;}
  //           else { this.x+=2;}
  //   } else if (mouseX > windowWidth-80){
  //       if(keyCode === SHIFT && keyIsPressed){
  //           this.x-=8;}
  //           else { this.x-=2;}
  //   }
  //   // if (mouseY < 80 && relativeY < 0){
  //   //     if(keyCode === SHIFT && keyIsPressed){
  //   //         relativeY+=8;}
  //   //         else { relativeY+=2;}
        
  //   // } else if (mouseY > windowHeight-80 && relativeY > -1600){
  //   //     if(keyCode === SHIFT && keyIsPressed){
  //   //         relativeY-=8;}
  //   //         else { relativeY-=2;}
  //   //     }
  //   }
});
// GOS.createNode('Root', 'UI', 1, [], class UI { constructor() { } })

GOS.initialized.addListener(() => {
  createCanvas(windowWidth,windowHeight);
  soundFormats('mp3');
});

GOS.get('Root').update = () => {
  GXY.moveWindow();
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
  console.log(GXY.transform(-mouseX, "x"), GXY.transform(-mouseY, "y"))
}


window.GOS = GOS;
window.GXY = GXY;

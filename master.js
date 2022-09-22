import * as GOS from './modules/gos-manager.js';
import * as GXY from './modules/GXY-manager.js';

document.body.style.overflow = 'hidden';

window.money = 5000;

GOS.createGameObject('./cityObjectHandler.js')
GOS.createGameObject('./road.js')
GOS.createGameObject('./mapHandler.js')
GOS.createGameObject('./UI-Handler.js')


GOS.get('root').setup = () => {
  createCanvas(windowWidth, windowHeight);
  soundFormats('mp3');
}

GOS.get('root').update = () => {
GXY.moveWindow();
background(182,219,246);
}

//temp function for debuggin'
window.newC = function(){
  GOS.get('cityManager').tryForCity();
}

window.mouseClicked = function(){
  console.log(GXY.transform(-mouseX,"x"),GXY.transform(-mouseY,"y"))
}


window.GOS = GOS;
window.GXY = GXY;

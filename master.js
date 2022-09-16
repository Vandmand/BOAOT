import * as GOS from './modules/gos-manager.js';
import { globalTransform } from './modules/globalTransform.js';

document.body.style.overflow = 'hidden';

GOS.createGameObject('./cityObjectHandler.js')
GOS.createGameObject('./road.js')
GOS.createGameObject('./mapHandler.js')



GOS.get('root').setup = () => {
  createCanvas(windowWidth,windowHeight);
}

GOS.get('root').update = () => {
translate(globalTransform()[0],globalTransform()[1])
if(mouseIsPressed){
  console.log(true)
}
}

//temp function for debuggin'
window.newC = function(){
  GOS.get('cityManager').tryForCity();
}


window.GOS = GOS;

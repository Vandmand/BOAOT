import * as GOS from './modules/gos-manager.js'

GOS.createGameObject('./cityObjectHandler.js')
GOS.createGameObject('./road.js')

GOS.get('root').setup = () => {
  createCanvas(windowWidth,windowHeight);
}

GOS.get('root').update = () => {
  background(50);
}

window.GOS = GOS;

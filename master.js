import * as GOS from './modules/gos-manager.js'

GOS.createGameObject('./testScript.js')
GOS.createGameObject('./cityObjectHandler.js')
// GOS.createGameObject('./road.js')

GOS.get('root').setup = () => {
  createCanvas(windowWidth,windowHeight);
}

GOS.get('root').update = () => {
  background(100);
}

window.GOS = GOS;

export var globalMoney = 100;
import * as GOS from './modules/gos-manager.js'

GOS.createGameObject('./testScript.js')

window.GOS = GOS;

GOS.get('root').setup = () => {
  createCanvas(windowWidth,windowHeight);
}

GOS.get('root').update = () => {
  background(220);
}


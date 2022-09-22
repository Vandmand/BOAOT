import * as GXY from './modules/GXY-manager.js'

let roadInt = 0;
GOS.createNode('root', 'roadManager', 0, [], class roadManager {
    constructor() {
        this.connection = undefined
        this.errorSoundEffect
    }
    createRoad(city1, city2) {
        GOS.createNode('roadManager', 'road' + roadInt++, 2, [city1, city2], class Mono {
            constructor(city1) {
                this.city1 = city1
                this.city2;
            }
            update() {
                let secondSet = this.city2 ? this.city2 : {x: mouseX-GXY.relativeX, y: mouseY-GXY.relativeY}
                strokeWeight(15)
                line(GXY.transform(this.city1.x,'x'),GXY.transform(this.city1.y,'y'), GXY.transform(secondSet.x,'x'), GXY.transform(secondSet.y,'y'))
            }
            finish(city2) {
                this.city2 = city2
                if (city1.neighbors.indexOf(this.city2.name) != -1) {
                    GOS.deleteNode('roadManager.' + this.name)
                } else {
                    this.city2 = city2
                    city1.neighbors.push(this.city2)
                    city2.neighbors.push(this.city1)
                    window.money -= Math.floor(dist(this.city1.x,this.city1.y,this.city2.x,this.city2.y) * 10)
                }
            }
        })
    }

    setup(){
    this.errorSoundEffect = loadSound('./assets/sound/Error.mp3');
    }
    addRoad(node) {
        if(window.money > 0){
        if (this.connection) {
            if (node.name == this.connection.name) {
                return
            } else {
                GOS.get('roadManager.road' + (roadInt-1).toString()).finish(node);
                this.connection = undefined;
            }
        } else {
            this.connection = node;
            this.createRoad(this.connection, { x: mouseX, y: mouseY })
        }
    } 
    else{this.errorSoundEffect.play();
    }
}
})
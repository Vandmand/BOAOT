let roadInt = 0;
GOS.createNode('Root', 'roadManager', 0, [], class roadManager {
    constructor() {
        this.connection = undefined
        this.errorSoundEffect
    }
    createRoad(city1, city2) {
        GOS.createNode('roadManager', 'road' + roadInt++, 2, [city1, city2], class Mono {
            constructor(city1) {
                this.city1 = city1;
                this.city2;
            }
            update() {
                let secondSet = this.city2 ? this.city2 : {Position: {x: mouseX, y: mouseY }};
                strokeWeight(15);
                line(this.city1.Position.x,this.city1.Position.y, secondSet.Position.x, secondSet.Position.y)
            }
            finish(city2) {
                this.city2 = city2
                if (city1.neighbors.indexOf(this.city2.id) != -1) {
                    GOS.deleteNode('roadManager.' + this.id)
                } else {
                    this.city2 = city2
                    city1.neighbors.push(this.city2)
                    city2.neighbors.push(this.city1)
                    window.money -= Math.floor(dist(this.city1.Position.x,this.city1.Position.y,this.city2.Position.x,this.city2.Position.y) * 10)
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
            if (node.id == this.connection.id) {
                return
            } else {
                GOS.get('roadManager.road' + (roadInt-1).toString()).finish(node);
                this.connection = undefined;
            }
        } else {
            this.connection = node;
            this.createRoad(this.connection, { x: mouseX, y: mouseY });
        }
    } 
    else{this.errorSoundEffect.play();
    }
}
})
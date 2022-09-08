GOS.createNode('root', 'roadManager', 2, [], class roadManager {
    constructor(){
        this.connection = undefined
    }
    createRoad(city1, city2){
        GOS.createNode('roadManager', 'road1', 2, [city1,city2], class Mono{
            constructor(city1,city2) {
                this.city1 = city1
                this.city2 = city2
            }
            update(){
                strokeWeight(22)
                line(this.city1.x,this.city2.y)
            }
        })
    }
    addRoad(node){
        if(node.name == this.connection.name){
            return
        }
        if(this.connection){
            this.createRoad(this.connection,node)
            this.connection = undefined;
        } else {
            this.connection = node;
        }
    }
})
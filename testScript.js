GOS.createNode('root', 'roadManager', 2, [], class roadManager {
    constructor(){
        this.x = 2
    }
    createRoad(a,b){
        GOS.createNode('roadManager', 'road1', 2, [a,b], class Mono{
            constructor(a,b) {
                this.a = a
                this.b = b
            }
            update(){
                strokeWeight(22)
                line(a.x, a.y, b.x, b.y)
            }
        })
    }
})
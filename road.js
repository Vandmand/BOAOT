GOS.createNode('root', 'roadManager', 0, [], class roadManager {
    constructor(){
        this.connection = undefined
    }
    createRoad(city1, city2){
        GOS.createNode('roadManager', 'road' + city1.name + city2.name, 2, [city1,city2], class Mono{
            constructor(city1,city2) {
                this.city1 = city1
                this.city2 = city2
            }
            update(){
                strokeWeight(22)
                line(this.city1.x,this.city1.y,this.city2.x,this.city2.y)
            }
            setup(){
                let con2 = city2.connections
                let con1 = city1.connections
                con2[city1.name] = [city2]
                con1[city2.name] = [city1]
                console.log(con1,con2)

                city1.updateConnection(city2, con2)
                city2.updateConnection(city1, con1)

                city1.neighbors.push(city2)
                city2.neighbors.push(city1)
            }
        })
    }
    addRoad(node){
        if(this.connection){
            if(node.name == this.connection.name){
                return
            }
            this.createRoad(this.connection,node)
            this.connection = undefined;
        } else {
            this.connection = node;
        }
    }
})
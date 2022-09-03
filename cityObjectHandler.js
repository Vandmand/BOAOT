import * as GOS from './modules/gos-manager.js'

GOS.createNode('root', 'cityManager', 1, [], class cityManager{
    constructor(){
        this.cities = [];
    }
    createCity(x, y, name){
        this.cities.push(
        GOS.createNode('cityManager','city','1',[x, y, cityExport, cityImport, name], class mono{
            constructor(x, y, name){
                this.x = x;
                this.y = y;
                this.name = name;
                this.export 
                this.import
                this.timeSinceSupply = 0;
            }
            


        }))
    }

    assignTrade(){
        let i = 0;
        while(typeof this.cities[i].export !== 'undefined'){i++;}
        this.cities[i].export = this.cities[i+1].name
        this.cities[i+1].import = this.cities[i].name

    }
})
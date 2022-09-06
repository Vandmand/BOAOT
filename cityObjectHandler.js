import * as GOS from './modules/gos-manager.js';
import globalMoney from './master.js';

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
            
            getExport(){ //simple getter for export
                return this.export
            }

            update(){
                this.timeSinceSupply++

                this.drawCity()
            }

            drawCity(){
                circle(x, y, 10) //temporary visual representation of cities
            }

            supplyCity(tradeImport){
                if(this.import === tradeImport){
                    this.timeSinceSupply = 0;
                  globalMoney += 10;
                } else{throw TypeError('incorrect import');}
            }
        }))
    }

    assignTrade(){ //assigns import and export in pairs
        let i = 0;
        while(typeof this.cities[i].export !== 'undefined' && this.cities.length > i){i++;}
        if (this.cities.length >= i+1){
        this.cities[i].export = this.cities[i+1];
        this.cities[i+1].import = this.cities[i];
    } else{throw RangeError('Not enough cities');}

    }
})
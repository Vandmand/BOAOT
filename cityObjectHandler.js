import {cityData} from './modules/cityData.js'

GOS.createNode('root', 'cityManager', 1, [], class cityManager{
    constructor(){
     this.cities = [];
    }
    createCity(x, y, name){
        GOS.createNode('cityManager', name, '1', [x, y,], class mono{
            constructor(x, y, name){
                this.x = x;
                this.y = y;
                this.name = name;
                this.tradeExport;
                this.tradeImport;
                this.timeSinceSupply = 0;

            }

            update(){
                // Elias was here
                if(mouseOverCity() && mousePressed()){
                    GOS.get('roadManager').addRoad(this);
                }

                this.timeSinceSupply++ 
                this.drawCity()
            }

            drawCity(){
                strokeWeight(1);
                circle(this.x, this.y, 50); //temporary visual representation of cities
                //temporary display of name and export/import
                text(this.name, x, y);

            }

            supplyCity(tradeImport){
                if(this.tradeImport === tradeImport){
                    this.timeSinceSupply = 0;
                  globalMoney += 10;
                } else{throw TypeError('incorrect import');}
            }

            getExport(){ //simple getter for exports
                return this.tradeExport
            }

        })
        this.cities.push(GOS.get('cityManager.' + name));
    }

    // ======== cityHandler Methods =======
    gameStart(){ //upon game start, 2 cities must be initilized before we assign them trade
    while (this.cities.length < 2) {
        let cityDataIndex = Math.floor(random(0, cityData.length));
        this.createCity(random(0, windowWidth),random(0, windowHeight),cityData[cityDataIndex].name);
        cityData.splice(cityDataIndex);
    } 
    this.assignTrade();
        
    }
      

    update(){

    }

    assignTrade(){ //assigns import and export in pairs
        let i = 0;
        while(typeof this.cities[i].tradeExport !== 'undefined' && this.cities.length-1 > i){i++;}
        if (this.cities.length-1 >= i+1){
        this.cities[i].tradeExport = this.cities[i+1];
        this.cities[i+1].tradeImport = this.cities[i];
    } else{throw RangeError('Not enough unassigned cities to assign trade');}

    }
})


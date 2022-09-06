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
                this.export 
                this.import
                this.timeSinceSupply = 0;
            }

            update(){
                this.timeSinceSupply++ 
                this.drawCity()
            }

            drawCity(){
                strokeWeight(1);
                circle(this.x, this.y, 50); //temporary visual representation of cities
            }

            supplyCity(tradeImport){
                if(this.import === tradeImport){
                    this.timeSinceSupply = 0;
                  globalMoney += 10;
                } else{throw TypeError('incorrect import');}
            }

            getExport(){ //simple getter for export
                return this.export
            }

        })
        this.cities.push(GOS.get('cityManager.'+name)); //push the initialized city into the cities aray for easier access
    }

    // ======== cityHandler Methods =======
    update(){

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


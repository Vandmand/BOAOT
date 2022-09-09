import {cityData} from './modules/cityData.js'

GOS.createNode('root', 'cityManager', 1, [], class cityManager{
    constructor(){
     this.cities = [];
     this.counter = 0;
    }
    createCity(x, y, name){
        GOS.createNode('cityManager', name, '1', [x, y], class mono{
            constructor(x, y, name){
                this.x = x;
                this.y = y;
                this.name = name;
                this.tradeExport;
                this.tradeImport;
                this.timeSinceSupply = 0;
                this.isReal = typeof name === 'string' ? false : true;

                this.connections = []
            }
            addConnection(city){
                
            }
            update(){
                // Elias was here
                if(this.mouseOverCity() && mouseIsPressed){
                    GOS.get('roadManager').addRoad(this);
                }

                if(this.isReal){
                this.timeSinceSupply++;
                this.drawCity();
                this.displayTrade();
             }    
            }

            //====Visual methods====
            drawCity(){
                strokeWeight(1);
                circle(this.x, this.y, 50); //temporary visual representation of cities
                //temporary display of name and export/import
                textAlign(CENTER, CENTER)
                text(this.name, x, y);

            }

            displayTrade(){
                if(this.mouseOverCity()){
                    rectMode(CENTER);
                    line(this.x, this.y-25, this.x, this.y-50);
                    rect(this.x, this.y-50, 200, 25)
                    let ex = typeof this.tradeExport === 'object' ? this.tradeExport.name :'None';  
                    let im = typeof this.tradeImport === 'object' ? this.tradeImport.name :'None'; 
                    text('export: ' + ex + ' | import: ' + im, this.x, this.y-50);
                }
            }
            //====================
            mouseOverCity(){
               return dist(mouseX,mouseY,this.x,this.y) <= 25 ? true : false;
                 
            }



            supplyCity(tradeImport){
                if(this.tradeImport === tradeImport){
                    this.timeSinceSupply = 0;
                } else{throw TypeError('incorrect import');}
            }

            getExport(){ //simple getter for exports
                return this.tradeExport
            }

        })
        if(typeof name === 'string'){
        this.cities.push(GOS.get('cityManager.' + name));}
    }

    // ======== cityHandler Methods =======
    setup(){
        this.gameStart();
    }

    gameStart(){ //upon game start, 2 cities must be initilized before we assign them trade
    while (this.cities.length < 2) {
        let cityDataIndex = Math.floor(Math.random()*(cityData.length-1));
        this.createCity(random(0, windowWidth),random(0, windowHeight),cityData[cityDataIndex].name);
        cityData.splice(cityDataIndex, 1);
    } 
    this.assignTrade();
        
    }
      
    tryForCity() {
        // if(Math.random()*1000 < this.counter/1000){
            let cityDataIndex = Math.floor(Math.random()*(cityData.length-1));
            this.createCity(random(0, windowWidth),random(0, windowHeight),cityData[cityDataIndex].name);
            cityData.splice(cityDataIndex, 1);
            
            this.assignTrade();
        this.counter = 0;
        // } else{this.counter++;}
    }

    update(){
        // if(cityData.length != 0){
        // this.tryForCity();}
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


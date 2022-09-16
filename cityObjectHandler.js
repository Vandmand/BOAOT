import {cityData} from './modules/cityData.js'
import * as GXY from './modules/GXY-manager.js'
const mapHeight = 2234; const mapWidth = 4500;
let startDrag = false

GOS.createNode('root', 'cityManager', 1, [], class cityManager{
    constructor(){
     this.cities = [];
     this.counter = 0;
     this.cityGraphics = []; //it's loaded in the city manager to reduce stress
     this.citySoundEffect;
    }
    createCity(x, y, name, Graphics){
        GOS.createNode('cityManager', name, '1', [x, y, Graphics = this.cityGraphics], class mono{
            constructor(x, y, name, Graphics){
                this.x = x;
                this.y = y;
                this.name = name;
                this.tradeExport;
                this.tradeImport;
                this.timeSinceSupply = 0;
                this.isReal = typeof name === 'string' ? false : true;
                this.cityGraphics = Graphics;
                this.visualDiameter = 50
                this.initialSize = 1; //used to make a simple iteration animation

                this.nextExport = 0
                this.neighbors = []
            }
            createPacket(from, to) {
                GOS.createNode('root', 'packetFrom' + from.name + 'To' + to.name, -1, [from, to], class Packet {
                    constructor(from, to) {
                        this.from = from
                        this.here = [from]
                        this.to = to
                        this.distanceToTarget = undefined
                        this.i = 0
                    }
                    setup() {
                        let depth = this.move(this.from);
                        if (depth != 0) {
                            setTimeout(() => {
                                console.log('Delivered from ' + this.from.name + ' to ' + this.to.name);
                                GOS.deleteNode(this.name);
                            }, depth * 1000)
                        }
                    }
                    move(node) {
                        if (this.i > 50) {
                            return 0
                        } else {
                            node.neighbors.forEach(neighbor => {
                                this.i++
                                if (neighbor.name == this.to.name) {
                                    return this.i;
                                } else if (this.here.indexOf(neighbor.name) == -1) {
                                    this.here.push(neighbor.name);
                                    this.move(neighbor);
                                }
                                this.i--
                            })
                            return this.i;
                        }
                    }
                });
            }

            update(){
                // Elias was here
                if (this.mouseOverCity() && keyIsDown(32) && !startDrag) {
                    startDrag = true
                    GOS.get('roadManager').addRoad(this);
                } else if (!keyIsDown(32)) {
                    startDrag = false
                }
                if (this.tradeExport && this.nextExport == 0) {
                    this.createPacket(this, this.tradeExport)
                    this.nextExport = 600
                } else if (this.nextExport > 0) {
                    this.nextExport--
                }

                if (this.isReal) {
                    if (typeof this.tradeImport != 'Undefined') {
                    this.timeSinceSupply++;}
                    this.drawCity();
                    this.displayInfo();
                }
            }

            //====Visual methods====
            drawCity() {
                strokeWeight(1);
                if (this.initialSize < this.visualDiameter){ //small animation for when the city spawns
                    image(Graphics[0],GXY.transform(this.x,"x")-this.initialSize/2,GXY.transform(this.y,"y")-this.initialSize/2,this.initialSize,this.initialSize);
                    this.initialSize ++;
                } else {
                    image(Graphics[0],GXY.transform(this.x,"x")-this.visualDiameter/2, GXY.transform(this.y,"y")-this.visualDiameter/2,this.visualDiameter,this.visualDiameter);}
            }

            displayInfo(){
                if(this.mouseOverCity()){
                    textAlign(CENTER, CENTER)
                    rectMode(CENTER);
                    let tempX = GXY.transform(this.x,"x")
                    let tempY = GXY.transform(this.y,"y")
                    line(tempX, tempY-25, tempX, tempY-50);
                    rect(tempX, tempY-50-6.25, 200, 25+12.5)
                    let ex = typeof this.tradeExport === 'object' ? this.tradeExport.name :'None';  
                    let im = typeof this.tradeImport === 'object' ? this.tradeImport.name :'None'; 
                    text('export: ' + ex + ' | import: ' + im, tempX, tempY-50);
                    text(this.name, tempX, tempY-50-25/2,this.visualDiameter);
                }
            }
            //====================
            mouseOverCity(){
            return dist(mouseX,mouseY,GXY.transform(this.x,"x"),GXY.transform(this.y,"y")) <= this.visualDiameter/2 ? true : false;

            }
            supplyCity(tradeImport) {
                if (this.tradeImport === tradeImport) {
                    this.timeSinceSupply = 0;
                } else { throw TypeError('incorrect import'); }
            }

            getExport() { //simple getter for exports
                return this.tradeExport
            }

        })
        if(typeof name === 'string'){
        this.cities.push(GOS.get('cityManager.' + name));
        }

    } // end of createCity()

    // ======== cityHandler Methods =======
    setup() {
        this.gameStart();
        this.cityGraphics[0] = loadImage('./Graphics/City Icon/City_logo.png');
        soundFormats('mp3');
        this.citySoundEffect = loadSound('./Sound/Whoosh.mp3');
        console.log(this.citySoundEffect);
    }

    gameStart(){ //upon game start, 2 cities must be initilized before we assign them trade
        //start city:
        let cityDataIndex = Math.floor(Math.random()*(cityData.length-1));
        this.createCity(cityData[cityDataIndex].x,cityData[cityDataIndex].y,cityData[cityDataIndex].name);
        let city1 = cityData[cityDataIndex];
        cityData.splice(cityDataIndex, 1);
        //sorts all cities in a new array in decending order acording to distance to city1:
        let sortedDistance = [...cityData].sort((a,b) => dist(city1.x,city1.y,a.x,a.y) - dist(city1.x,city1.y,b.x,b.y))
        let threeCloesetsCities = sortedDistance.slice(0, 3); //then takes the tree first elements of that array
        //it then chooses a random of the 3 element and makes a city
        cityDataIndex = Math.floor(Math.random()*(threeCloesetsCities.length-1));
        this.createCity(threeCloesetsCities[cityDataIndex].x,threeCloesetsCities[cityDataIndex].y,threeCloesetsCities[cityDataIndex].name);
        cityData.splice(cityData.findIndex((element) => element.name = threeCloesetsCities[cityDataIndex].name), 1) //removes the city from the original cityData array

    this.assignTrade();
        
    }

    tryForCity() {
        // if(Math.random()*1000 < this.counter/1000){
            let cityDataIndex = Math.floor(Math.random()*(cityData.length-1));
            this.createCity(cityData[cityDataIndex].x,cityData[cityDataIndex].y,cityData[cityDataIndex].name);
            cityData.splice(cityDataIndex, 1);
            this.citySoundEffect.play();

            this.assignTrade();
        this.counter = 0;
        // } else{this.counter++;}
    }

    update() {
        // if(cityData.length != 0){
        // this.tryForCity();}

    }

    assignTrade() { //assigns import and export in pairs
        let i = 0;
        while (typeof this.cities[i].tradeExport !== 'undefined' && this.cities.length - 1 > i) { i++; }
        if (this.cities.length - 1 >= i + 1) {
            this.cities[i].tradeExport = this.cities[i + 1];
            this.cities[i + 1].tradeImport = this.cities[i];
        } else { throw RangeError('Not enough unassigned cities to assign trade'); }

    }
})


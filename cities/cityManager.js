import { cityData } from './cityData.js'

let difficulty = 3; //increase to make cities spawn further away from each other
let startDrag = false;

/**
 * @class GameObject for any city
 */
class City {
    constructor(x, y, Graphics, id) {
        this.id = id;
        this.tradeExport;
        this.tradeImport;
        this.timeSinceSupply = 0;
        this.isReal = typeof id === 'string' ? false : true;
        this.cityGraphics = Graphics;
        this.visualDiameter = 50;
        this.state = 0;
        this.initialSize = 1; //used to make a simple iteration animation
        this.nextExport = 0;
        this.neighbors = [];

        // Maybe find better system for this;
        this.x = x
        this.y = y
    }

    /**
     * @param  {Node} from - Where packet from
     * @param  {Node} to - Where packet to
     */
    createPacket(from, to) {
        GOS.createNode('Game', 'PacketFrom' + from.id + 'To' + to.id, -1, [from, to], class Packet {
            constructor(from, to) {
                this.from = from;
                this.here = [from];
                this.to = to;
                this.distanceToTarget = undefined;
                this.i = 0;
            }
            setup() {
                let depth = this.move(this.from);
                if (depth != 0) {
                    setTimeout(() => {
                        window.money += depth * 1000
                        GOS.get('UI').earned = '+' + (depth * 1000)
                        setTimeout(() => {
                            this.to.timeSinceSupply = 0;
                            GOS.get('UI').earned = ''
                        }, 2000)
                        GOS.deleteNode(this.id);
                    }, depth * 1000)
                }
            }
            move(node) {
                if (this.i > 50) {
                    return 0
                } else {
                    node.neighbors.forEach(neighbor => {
                        this.i++
                        if (neighbor.id == this.to.id) {
                            return this.i;
                        } else if (this.here.indexOf(neighbor.id) == -1) {
                            this.here.push(neighbor.id);
                            this.move(neighbor);
                        }
                        this.i--;
                    })
                    return this.i;
                }
            }
        });
    }
    setup() {
        this.Position.x = this.x;
        this.Position.y = this.y;
        delete this.x;
        delete this.y;
    }

    update() {
        // Elias was here
        if (this.mouseOverCity() && keyIsDown(32) && !startDrag) {
            startDrag = true
            GOS.get('roadManager').addRoad(this);
        } else if (!keyIsDown(32)) {
            startDrag = false
        }

        if (this.timeSinceSupply > 4000) {
            GOS.get('UI').game = false;
        } else if (this.timeSinceSupply > 1500) {
            this.state = 1
        } else if (this.timeSinceSupply > 3000) {
            this.state = 2
        } else {
            this.state = 0
        }

        if (this.tradeExport && this.nextExport == 0) {
            this.createPacket(this, this.tradeExport)
            this.nextExport = 600
        } else if (this.nextExport > 0) {
            this.nextExport--
        }

        if (this.isReal) {
            if (this.tradeImport) {
                this.timeSinceSupply++;
            }
            this.drawCity();
            this.displayInfo();
        }
    }

    /**
     * Assigns a trade to a city
     * @param  {Node} city - Target for import
     */
    assignTrade(city) {
        this.tradeImport = city;
        city.tradeExport = this;
    }

    //====Visual methods====
    drawCity() {
        strokeWeight(1);
        if (this.initialSize < this.visualDiameter) { //small animation for when the city spawns
            image(this.cityGraphics[this.state], this.Position.x - this.initialSize / 2, this.Position.y - this.initialSize / 2, this.initialSize, this.initialSize);
            this.initialSize++;
        } else {
            image(this.cityGraphics[this.state], this.Position.x - this.visualDiameter / 2, this.Position.y - this.visualDiameter / 2, this.visualDiameter, this.visualDiameter);
        }
    }

    displayInfo() {
        if (this.mouseOverCity()) {
            textAlign(CENTER, CENTER)
            rectMode(CENTER);
            let tempX = this.Position.x
            let tempY = this.Position.y
            line(tempX, tempY - 25, tempX, tempY - 50);
            rect(tempX, tempY - 50 - 6.25, 200, 25 + 12.5)
            let ex = typeof this.tradeExport === 'object' ? this.tradeExport.id : 'None';
            let im = typeof this.tradeImport === 'object' ? this.tradeImport.id : 'None';
            text('export: ' + ex + ' | import: ' + im, tempX, tempY - 50);
            text(this.id, tempX, tempY - 50 - 25 / 2, this.visualDiameter);
        }
    }
    //====================
    mouseOverCity() {
        return dist(mouseX, mouseY, this.Position.x, this.Position.y) <= this.visualDiameter / 2 ? true : false;
    }
    supplyCity(tradeImport) {
        if (this.tradeImport === tradeImport) {
            this.timeSinceSupply = 0;
        } else { throw TypeError('incorrect import'); }
    }
    getExport() { //simple getter for exports
        return this.tradeExport
    }
}

GOS.createNode('Game', 'CityManager', 1, [], class CityManager {
    constructor() {
        this.cities = [];
        this.counter = 0;
        this.cityGraphics = []; //it's loaded in the city manager to reduce stress
        this.citySoundEffect;

        this.cityData = cityData;
        console.log(cityData)
    }

    /**
     * Create new city GameObject
     * @param  {Number} x - x position for city
     * @param  {Number} y - y position for city
     * @param  {String} id - Gameobject id
     * @param  {String} Graphics - Images for rendering city
     */
    createCity(x, y, id, Graphics = this.cityGraphics) {
        const node = GOS.createNode('Game.CityManager', id, 1, [x, y, Graphics], City);
        if (typeof id === 'string') { this.cities.push(GOS.get('Game.CityManager.' + id)); }
        return node;
    }
    setup() {
        this.cityGraphics = [
            loadImage('./assets/city icon/City_logo.png'),
            loadImage('./assets/city icon/City_logo_dying.png'),
            loadImage('./assets/city icon/City_logo_extra_dying.png')
        ]
        this.gameStart();
        this.citySoundEffect = loadSound('./assets/sound/Whoosh.mp3');
    }

    gameStart() {
        const city1 = this.#getCity();
        const city2 = this.#getCity();

        const node1 = this.createCity(city1.x, city1.y, city1.name);
        const node2 = this.createCity(city2.x, city2.y, city2.name);

        node1.assignTrade(node2);
    }

    /**
     * tries to make a city based on chance
     */
    tryForCity() {
        if (Math.random() * 1000 > this.counter / 1000) { this.counter++; return; }

        const city = this.#getCity();
        this.createCity(city.x, city.y, city.name);

        this.citySoundEffect.play();
        this.counter = 0;
    }

    update() {
        if (cityData.length != 0) {
            this.tryForCity();
        }
    }

    /**
     * Get a city from database
     * @returns City node
     */
    #getCity() {
        const first = this.cities == 0 ? true : false;
        let arrIndex = first ? Math.floor(random(3)) : Math.floor(random(this.cityData.length));
        const city = this.cityData[arrIndex];
        if (first) {
            this.cityData.sort((a, b) => {
                dist(city.x, city.y, a.x, a.y) -
                    dist(city.x, city.y, b.x, b.y);
            });
        }
        this.cityData.splice(arrIndex,1);
        this.cities.push(city); 
        return city;
    }
});
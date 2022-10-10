let startDrag = false
export class City {
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

        this.x = x
        this.y = y
    }
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
                        this.i--
                    })
                    return this.i;
                }
            }
        });
    }
    setup(){
        this.Position.x = this.x
        this.Position.y = this.y
        delete this.x
        delete this.y
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
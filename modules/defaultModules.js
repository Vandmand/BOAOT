export class Position {
    constructor() {
        this.globalPosition = false;
        this.localX = 0;
        this.localY = 0;
    }
    get x() {
        if (this.globalPosition) return this.localX;
        return this.localX + this.node.parent.Position.x;
    }
    set x(val) {
        this.localX = val;
    }
    get y() {
        if (this.globalPosition) return this.localY;
        return this.localY + this.node.parent.Position.y;
    }
    set y(val) {
        this.localY = val;
    }
}

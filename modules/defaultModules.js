/**
 * @class a vector descriping positions
 * @todo add more functions to Vector2
 */
export class Vector2 {
    constructor(x = 0,y = 0) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return Object.assign({}, Vector2);
    }
    add(Vector2){
        this.x += Vector2.x;
        this.y += Vector2.y;
    }
    sub(Vector2){
        this.x -= Vector2.x;
        this.y -= Vector2.y;
    }

}

/**
 * @class positioning speifically for GameObjects
 */
export class Position extends Vector2{
    constructor() {
        super();
        this.globalPosition = false;
        this.localX = 0;
        this.localY = 0;
    }
    set(Vector2) {
        Vector2.x = this.localX;
        Vector2.y = this.localY;
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

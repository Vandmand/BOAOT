/**
 * @class a vector descriping positions
 * @todo add more functions to Vector2
 */
export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        this.mag;
        this.lAngle;
        this.useRadiants = false;
    }
    get angle(){
        if(this.useRadiants) return this.lAngle;
        return this.lAngle*(180/Math.PI);
    }
    /**
     * @returns new copy of Vector2
     */
    copy() {
        return { ...this };
    }
    /**
     * Add a vector to object
     * @param  {Vector2} Vector2
     */
    add(Vector2) {
        this.x += Vector2.x;
        this.y += Vector2.y;
    }
    /**
     * Subtract vetor from object
     * @param  {Vector2} Vector2
     */
    sub(Vector2) {
        this.x -= Vector2.x;
        this.y -= Vector2.y;
    }
    /**
     * Set coordinates of vector
     * @param  {Vector2} Vector2
     */
    set(Vector2) {
        this.x = Vector2.x;
        this.y = Vector2.y;
    }
    calcPolar() {
        this.mag = dist(0, 0, this.x, this.y);
        this.lAngle = Math.atan(this.x / this.y);
    }
}

/**
 * @class positioning speifically for GameObjects
 */
export class Position extends Vector2 {
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

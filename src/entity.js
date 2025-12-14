export class Entity {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
    
    move(dx, dy) {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }
}
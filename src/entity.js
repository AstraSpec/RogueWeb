export class Entity {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }

    draw(ctx) {
        ctx.font = '16x monospaced';
        ctx.fillStyle = 'yellow';
        ctx.fillText(this.type, this.x * 16, this.y * 16);
    }
    
    move(dx, dy) {
        this.x = this.x + dx;
        this.y = this.y + dy;
    }
}
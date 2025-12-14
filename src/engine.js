import { Entity } from './entity.js';
import { Control } from './control.js';
import { get_tile_size } from './constants.js'

const TILE_SIZE = get_tile_size();
const MOVE_DELAY = 90;

export class GameEngine {
    constructor(ctx, map) {
        this.ctx = ctx;
        this.map = map;
        this.entities = [];
        this.running = false;
        this.control;

        this.moveTimer = 0;
    }

    start() {
        const player = new Entity(16, 16, '@');
        const horse = new Entity(16, 18, 'P');
        this.entities.push(player);
        this.entities.push(horse);

        this.control = new Control((dx, dy) => this.handleMove(dx, dy));
        this.control.setController(player);
        
        this.running = true;
        this.loop();
    }

    loop() {
        this.update();
        this.render();
        if (this.running) {
            requestAnimationFrame(() => this.loop());
        }
    }

    update() {}

    render() {
        this.ctx.clearRect(0, 0, 512, 512)
        this.drawMap();

        for (const entity of this.entities) {
            this.setCell(entity.type, entity.x, entity.y, 'yellow');
        }
    }

    handleMove(dx, dy) {
        const now = performance.now();
        if (now - this.moveTimer < MOVE_DELAY) return;
        this.moveTimer = now;

        const c = this.control.getController();
        
        const newX = c.x + dx;
        const newY = c.y + dy;

        if (c) {
            this.moveTime = 0;
            if (this.map.tiles[newY][newX] !== '#')
                c.move(dx, dy);
        }
    }

    setCell(type, x, y, fillStyle) {
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillText(type, x * TILE_SIZE, y * TILE_SIZE);
    }

    drawMap() {
        for (let y = 0; y < this.map.size; y++) {
            for (let x = 0; x < this.map.size; x++) {
                this.setCell(this.map.tiles[y][x], x, y, 'white');
            }
        }
    }
}

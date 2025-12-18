import { get_tile_size } from './constants.js';

const TILE_SIZE = get_tile_size();

export class Render {
    constructor(ctx, eventBus, map, entityManager) {
        this.ctx = ctx;
        this.eventBus = eventBus;
        this.map = map;
        this.entityManager = entityManager;

        this.eventBus.on('entity:moved', () => {
            this.updateScreen();
        });

        this.eventBus.on('render:screen', () => {
            this.updateScreen();
        });

        this.updateScreen();
    }

    setCell(char, x, y, fillStyle = 'white') {
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = fillStyle;
        this.ctx.fillText(char, x * TILE_SIZE, y * TILE_SIZE);
    }

    updateScreen() {
        const sizeInPixels = this.map.size * TILE_SIZE;
        this.ctx.clearRect(0, 0, sizeInPixels, sizeInPixels);

        // Draw map tiles
        for (let y = 0; y < this.map.size; y++) {
            for (let x = 0; x < this.map.size; x++) {
                this.setCell(this.map.tiles[y][x], x, y, 'white');
            }
        }

        // Draw entities
        for (const entity of this.entityManager.entities) {
            this.setCell(entity.type, entity.x, entity.y, 'yellow');
        }
    }
}
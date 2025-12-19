export class Render {
    constructor(ctx, eventBus, map, entityManager, gameState, camera) {
        this.ctx = ctx;
        this.eventBus = eventBus;
        this.map = map;
        this.entityManager = entityManager;
        this.gameState = gameState;
        this.camera = camera;

        this.eventBus.on('entity:moved', () => {
            this.updateScreen();
        });

        this.eventBus.on('render:screen', () => {
            this.updateScreen();
        });

        this.updateScreen();
    }

    setCell(char, x, y, fillStyle = 'white') {
        const tileSize = this.gameState.get('config.tileSize', 16);
        this.ctx.font = '16px monospace';
        this.ctx.fillStyle = fillStyle;
        
        const screenPos = this.camera.worldToScreen(x, y);
        
        this.ctx.fillText(char, screenPos.x, screenPos.y);
    }

    updateScreen() {
        const tileSize = this.gameState.get('config.tileSize', 16);
        const sizeInPixels = this.map.size * tileSize;
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
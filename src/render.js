export class Render {
    constructor(ctx, eventBus, map, entityManager, gameState, camera, registries) {
        this.ctx = ctx;
        this.eventBus = eventBus;
        this.map = map;
        this.entityManager = entityManager;
        this.gameState = gameState;
        this.camera = camera;
        this.registries = registries;

        // Enable high-quality text rendering
        this.ctx.textRenderingOptimization = 'optimizeQuality';
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';

        this.eventBus.on('entity:moved', () => {
            this.updateScreen();
        });

        this.eventBus.on('render:screen', () => {
            this.updateScreen();
        });

        this.updateScreen();
    }

    setCell(char, x, y, fillStyle = 'white', backgroundColor = null) {
        const tileSize = this.gameState.get('config.tileSize', 16);
        const screenPos = this.camera.worldToScreen(x, y);
        
        // Draw background color if provided
        if (backgroundColor) {
            this.ctx.fillStyle = backgroundColor;
            this.ctx.fillRect(screenPos.x, screenPos.y - tileSize, tileSize, tileSize);
        }
        
        // Draw character - use tileSize for font size and center it
        // Use system fonts that handle emojis better, fallback to monospace
        this.ctx.font = `${tileSize}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", monospace`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = fillStyle;
        
        // Center the character in the tile
        const centerX = screenPos.x + tileSize / 2;
        const centerY = screenPos.y - tileSize / 2;
        this.ctx.fillText(char, centerX, centerY);
        
        // Reset text alignment for other operations
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'alphabetic';
    }

    updateScreen() {
        // Clear entire canvas (use camera viewport dimensions)
        const viewportWidth = this.camera.viewportWidth;
        const viewportHeight = this.camera.viewportHeight;
        this.ctx.clearRect(0, 0, viewportWidth, viewportHeight);

        // Draw map tiles
        for (let y = 0; y < this.map.size; y++) {
            for (let x = 0; x < this.map.size; x++) {
                const tileChar = this.map.tiles[y][x];
                let color = 'white';
                let backgroundColor = null;
                
                // Get tile color and background from TileRegistry if available
                if (this.registries && this.registries.tiles) {
                    const tile = this.registries.tiles.getTileByChar(tileChar);
                    if (tile) {
                        if (tile.color) {
                            color = tile.color;
                        }
                        if (tile.background) {
                            backgroundColor = tile.background;
                        }
                    }
                }
                
                this.setCell(tileChar, x, y, color, backgroundColor);
            }
        }

        // Draw entities
        for (const entity of this.entityManager.entities) {
            this.setCell(entity.type, entity.x, entity.y, 'yellow');
        }
    }
}
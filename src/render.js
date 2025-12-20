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

        // Calculate visible chunks based on camera position
        const cameraPos = this.camera.getPosition();
        const tileSize = this.gameState.get('config.tileSize', 16);
        const chunkSize = this.map.chunkSize;
        
        // Calculate viewport bounds in world coordinates
        const tilesVisibleX = Math.ceil(viewportWidth / tileSize) + 2; // +2 for padding
        const tilesVisibleY = Math.ceil(viewportHeight / tileSize) + 2;
        
        const minWorldX = Math.floor(cameraPos.x - tilesVisibleX / 2);
        const maxWorldX = Math.ceil(cameraPos.x + tilesVisibleX / 2);
        const minWorldY = Math.floor(cameraPos.y - tilesVisibleY / 2);
        const maxWorldY = Math.ceil(cameraPos.y + tilesVisibleY / 2);
        
        // Calculate which chunks are visible
        const minChunkX = Math.floor(minWorldX / chunkSize);
        const maxChunkX = Math.ceil(maxWorldX / chunkSize);
        const minChunkY = Math.floor(minWorldY / chunkSize);
        const maxChunkY = Math.ceil(maxWorldY / chunkSize);
        
        // Generate and render only visible chunks
        for (let chunkY = minChunkY; chunkY <= maxChunkY; chunkY++) {
            for (let chunkX = minChunkX; chunkX <= maxChunkX; chunkX++) {
                // Get chunk (will generate if it doesn't exist)
                const chunk = this.map.getChunk(chunkX, chunkY);
                
                if (!chunk) continue;
                
                // Calculate world position of chunk origin
                const worldStartX = chunk.chunkX * chunkSize;
                const worldStartY = chunk.chunkY * chunkSize;
                
                // Draw tiles in this chunk
                for (let localY = 0; localY < chunkSize; localY++) {
                    for (let localX = 0; localX < chunkSize; localX++) {
                        const worldX = worldStartX + localX;
                        const worldY = worldStartY + localY;
                        
                        // Skip tiles outside viewport
                        if (worldX < minWorldX || worldX > maxWorldX || 
                            worldY < minWorldY || worldY > maxWorldY) {
                            continue;
                        }
                        
                        // Get tile ID from map (uses chunk type)
                        const tileId = this.map.getTileId(worldX, worldY);
                        let char = ' ';
                        let color = 'white';
                        let backgroundColor = null;
                        
                        // Get tile data from TileRegistry if available
                        if (tileId && this.registries && this.registries.tiles) {
                            const tile = this.registries.tiles.get(tileId);
                            if (tile) {
                                char = tile.char || ' ';
                                if (tile.color) {
                                    color = tile.color;
                                }
                                if (tile.background) {
                                    backgroundColor = tile.background;
                                }
                            }
                        }
                        
                        this.setCell(char, worldX, worldY, color, backgroundColor);
                    }
                }
            }
        }

        // Draw entities
        if (this.entityManager && this.entityManager.entities) {
            for (const entity of this.entityManager.entities) {
                let char = '?';
                let color = 'yellow';
                
                // Get entity data from registry if available
                if (entity.id && this.registries && this.registries.entities) {
                    const entityData = this.registries.entities.get(entity.id);
                    if (entityData) {
                        char = entityData.char || '?';
                    }
                } else if (entity.type) {
                    // Fallback to type if no registry
                    char = entity.type;
                }
                
                this.setCell(char, entity.x, entity.y, color);
            }
        }
    }
}
export class Camera {
    constructor(eventBus, gameState, viewportWidth = 512, viewportHeight = 512) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        // Follow player position changes
        this.eventBus.on('state:changed', (data) => {
            if (data.path === 'playerPosition') {
                this.followPlayer(data.newValue);
            }
        });
    }

    followPlayer(playerPosition) {
        // Simple camera following - can be enhanced with smoothing, bounds checking, etc.
        this.gameState.set('cameraPosition', { 
            x: playerPosition.x, 
            y: playerPosition.y 
        });
    }

    // Convert world coordinates to screen coordinates
    worldToScreen(worldX, worldY) {
        const cameraPos = this.gameState.get('cameraPosition', { x: 0, y: 0 });
        const tileSize = this.gameState.get('config.tileSize', 16);
        const zoom = this.gameState.get('cameraZoom', 1);
        
        // Center the camera: offset by half viewport size
        const centerX = this.viewportWidth / 2;
        const centerY = this.viewportHeight / 2;
        
        return {
            x: centerX + (worldX - cameraPos.x) * tileSize * zoom,
            y: centerY + (worldY - cameraPos.y) * tileSize * zoom
        };
    }

    // Get current camera position
    getPosition() {
        return this.gameState.get('cameraPosition', { x: 0, y: 0 });
    }

    // Get current zoom level
    getZoom() {
        return this.gameState.get('cameraZoom', 1);
    }

    // Set zoom level
    setZoom(zoom) {
        this.gameState.set('cameraZoom', zoom);
    }
}


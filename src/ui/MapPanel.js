import { Panel } from './Panel.js';

/**
 * MapPanel UI element - displays the game map
 * Extends Panel base class
 */
export class MapPanel extends Panel {
    constructor(options = {}) {
        // Set default options for map panel
        const mapOptions = {
            width: options.width || '600px',
            height: options.height || '600px',
            position: options.position || 'center',
            showCloseButton: options.showCloseButton !== false,
            visible: false, // Hidden by default
            ...options
        };
        
        super(mapOptions);
        
        this.eventBus = options.eventBus || null;
        this.map = options.map || null;
        this.registries = options.registries || null;
        this.gameState = options.gameState || null;
        this.addClass('ui-map-panel');
        this.setupMap();
    }
    
    /**
     * Sets up the map display area
     */
    setupMap() {
        if (!this.element) return;
        
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.className = 'ui-map-container';
        mapContainer.style.width = '100%';
        mapContainer.style.height = '100%';
        mapContainer.style.background = '#1a1a1a';
        mapContainer.style.border = '1px solid #333';
        mapContainer.style.borderRadius = '4px';
        mapContainer.style.position = 'relative';
        mapContainer.style.overflow = 'auto';
        
        // Create canvas for rendering chunks
        const canvas = document.createElement('canvas');
        canvas.style.display = 'block';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.imageRendering = 'pixelated';
        
        mapContainer.appendChild(canvas);
        
        // Insert map container before close button
        const closeButton = this.element.querySelector('.ui-panel-close');
        if (closeButton) {
            this.element.insertBefore(mapContainer, closeButton);
        } else {
            this.element.appendChild(mapContainer);
        }
        
        this.mapContainer = mapContainer;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }
    
    /**
     * Updates the map display with chunks
     */
    updateMap() {
        if (!this.map || !this.canvas || !this.ctx) return;
        
        // Get map size from gameState config, default to 128
        const mapSize = this.gameState ? this.gameState.get('config.mapSize', 128) : 128;
        
        // Calculate canvas size - show one pixel per chunk
        const pixelsPerChunk = Math.floor(600 / mapSize); // Fit in 600px width
        const canvasWidth = mapSize * pixelsPerChunk;
        const canvasHeight = mapSize * pixelsPerChunk;
        
        // Set canvas size
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Get player position to highlight current chunk
        let playerChunkX = null;
        let playerChunkY = null;
        if (this.gameState) {
            const playerPos = this.gameState.get('playerPosition', null);
            if (playerPos) {
                const coords = this.map.getChunkCoords(playerPos.x, playerPos.y);
                playerChunkX = coords.chunkX;
                playerChunkY = coords.chunkY;
            }
        }
        
        // Render all chunks in 128x128 grid
        for (let chunkY = 0; chunkY < mapSize; chunkY++) {
            for (let chunkX = 0; chunkX < mapSize; chunkX++) {
                // Get chunk (will create if doesn't exist for display)
                const chunk = this.map.getChunk(chunkX, chunkY);
                
                if (!chunk) continue;
                
                // Get chunk type data from registry
                let color = '#3eba30'; // Default green
                let char = '';
                
                if (this.registries && this.registries.chunks) {
                    const chunkData = this.registries.chunks.get(chunk.type);
                    if (chunkData) {
                        color = chunkData.background || color;
                        char = chunkData.char || '';
                    }
                }
                
                // Calculate screen position
                const screenX = chunkX * pixelsPerChunk;
                const screenY = chunkY * pixelsPerChunk;
                
                // Highlight player's current chunk
                const isPlayerChunk = (chunkX === playerChunkX && chunkY === playerChunkY);
                
                this.ctx.fillStyle = color;
                this.ctx.fillRect(screenX, screenY, pixelsPerChunk, pixelsPerChunk);
                
                // Draw border - thicker/highlighted for player chunk
                if (isPlayerChunk) {
                    this.ctx.strokeStyle = '#ffff00'; // Yellow highlight
                    this.ctx.lineWidth = 2;
                } else {
                    this.ctx.strokeStyle = '#444';
                    this.ctx.lineWidth = 1;
                }
                this.ctx.strokeRect(screenX, screenY, pixelsPerChunk, pixelsPerChunk);
                
                // Draw character if available and space permits
                if (char && pixelsPerChunk >= 4) {
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = `${Math.max(4, pixelsPerChunk - 1)}px monospace`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(char, screenX + pixelsPerChunk / 2, screenY + pixelsPerChunk / 2);
                }
            }
        }
    }
    
    /**
     * Override show to render map
     */
    show() {
        super.show();
        // Small delay to ensure canvas is visible
        setTimeout(() => this.updateMap(), 10);
        
        // Listen for player movement to update map
        if (this.eventBus && !this.playerMoveListener) {
            this.playerMoveListener = this.eventBus.on('entity:moved', () => {
                if (this.isVisible) {
                    this.updateMap();
                }
            });
            
            // Also listen for state changes to player position
            this.stateChangeListener = this.eventBus.on('state:changed', (data) => {
                if (data.path === 'playerPosition' && this.isVisible) {
                    this.updateMap();
                }
            });
        }
    }
    
    /**
     * Override hide to clean up listeners
     */
    hide() {
        super.hide();
        // Note: We keep listeners active so map updates when player moves even if panel is hidden
    }
    
    /**
     * Override close to clean up listeners
     */
    close() {
        if (this.playerMoveListener) {
            this.playerMoveListener();
            this.playerMoveListener = null;
        }
        if (this.stateChangeListener) {
            this.stateChangeListener();
            this.stateChangeListener = null;
        }
        super.close();
    }
}


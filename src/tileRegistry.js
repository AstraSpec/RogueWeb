export class TileRegistry {
    constructor(resourceManager, eventBus) {
        this.resourceManager = resourceManager;
        this.eventBus = eventBus;
        this.tilesById = new Map();
        this.tilesByChar = new Map();
        this.initialized = false;
    }

    // Initialize the tile registry by loading tiles.json
    async initialize() {
        if (this.initialized) {
            return;
        }

        try {
            const data = await this.resourceManager.load('tiles');
            
            if (!data.tiles || !Array.isArray(data.tiles)) {
                throw new Error('Invalid tiles.json format: expected "tiles" array');
            }

            // Build lookup maps
            for (const tile of data.tiles) {
                // Validate tile structure
                if (!tile.id || !tile.char || typeof tile.solid !== 'boolean') {
                    console.warn('Invalid tile definition:', tile);
                    continue;
                }

                this.tilesById.set(tile.id, tile);
                this.tilesByChar.set(tile.char, tile);
            }

            this.initialized = true;
            this.eventBus.emit('tiles:loaded', { count: this.tilesById.size });
        } catch (error) {
            console.error('Failed to initialize TileRegistry:', error);
            this.eventBus.emit('tiles:error', { error });
            throw error;
        }
    }

    // Get tile definition by ID
    getTileById(id) {
        return this.tilesById.get(id);
    }

    // Get tile definition by character symbol
    getTileByChar(char) {
        return this.tilesByChar.get(char);
    }

    // Check if a tile is solid (blocks movement)
    isSolid(tileId) {
        const tile = this.getTileById(tileId);
        return tile ? tile.solid : false;
    }

    // Check if a tile is solid by character
    isSolidByChar(char) {
        const tile = this.getTileByChar(char);
        return tile ? tile.solid : false;
    }

    // Get all tile IDs
    getAllTileIds() {
        return Array.from(this.tilesById.keys());
    }

    // Check if registry is initialized
    isInitialized() {
        return this.initialized;
    }
}


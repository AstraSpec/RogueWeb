import { Registry } from './registry.js';

export class TileRegistry extends Registry {
    constructor(resourceManager, eventBus) {
        super(resourceManager, eventBus, {
            resourceName: 'tiles',
            dataKey: 'tiles',
            eventPrefix: 'tiles'
        });
    }

    // Validate tile structure
    validateItem(tile) {
        return tile && tile.id && tile.char && typeof tile.solid === 'boolean';
    }

    // Check if a tile is solid (blocks movement)
    isSolid(tileId) {
        const tile = this.get(tileId);
        return tile ? tile.solid : false;
    }
}


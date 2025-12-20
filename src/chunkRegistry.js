import { Registry } from './registry.js';

export class ChunkRegistry extends Registry {
    constructor(resourceManager, eventBus) {
        super(resourceManager, eventBus, {
            resourceName: 'chunks',
            dataKey: 'chunks',
            eventPrefix: 'chunks'
        });
    }

    // Validate chunk structure
    validateItem(chunk) {
        return chunk && chunk.id;
    }
}


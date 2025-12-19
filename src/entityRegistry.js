import { Registry } from './registry.js';

export class EntityRegistry extends Registry {
    constructor(resourceManager, eventBus) {
        super(resourceManager, eventBus, {
            resourceName: 'entities',
            dataKey: 'entities',
            eventPrefix: 'entities'
        });
        
        // Custom lookup map for character-based lookups
        this.entitiesByChar = new Map();
    }

    // Validate entity structure - requires id, name, and char
    validateItem(entity) {
        return entity && entity.id && entity.name && entity.char;
    }

    // Build lookup maps - adds character-based lookup
    buildLookups(entity) {
        super.buildLookups(entity); // ID lookup via base class
        this.entitiesByChar.set(entity.char, entity); // Character lookup
    }
}


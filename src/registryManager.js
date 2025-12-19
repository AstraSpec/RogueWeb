import { TileRegistry } from './tileRegistry.js';

export class RegistryManager {
    constructor(resourceManager, eventBus) {
        this.resourceManager = resourceManager;
        this.eventBus = eventBus;
        
        // Initialize all registries
        this.tiles = new TileRegistry(resourceManager, eventBus);
    }

    // Initialize all registries
    async initializeAll() {
        const initPromises = [];
        
        // Initialize all registries in parallel
        if (this.tiles && typeof this.tiles.initialize === 'function') {
            initPromises.push(this.tiles.initialize());
        }
        
        await Promise.all(initPromises);
        
        this.eventBus.emit('registries:initialized', {
            registries: Object.keys(this).filter(key => 
                this[key] && typeof this[key].initialize === 'function'
            )
        });
    }

    // Initialize specific registries by name
    async initialize(registryNames) {
        const initPromises = [];
        
        for (const name of registryNames) {
            const registry = this[name];
            if (registry && typeof registry.initialize === 'function') {
                initPromises.push(registry.initialize());
            } else {
                console.warn(`Registry "${name}" not found or does not have initialize method`);
            }
        }
        
        await Promise.all(initPromises);
    }

    // Check if all registries are initialized
    isInitialized() {
        return Object.values(this).every(registry => 
            !registry || typeof registry.isInitialized !== 'function' || registry.isInitialized()
        );
    }
}


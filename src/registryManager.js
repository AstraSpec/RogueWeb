import { TileRegistry } from './tileRegistry.js';

const REGISTRY_CONFIG = [
    { name: 'tiles', class: TileRegistry },
];

export class RegistryManager {
    constructor(resourceManager, eventBus) {
        this.resourceManager = resourceManager;
        this.eventBus = eventBus;
        
        // Automatically create all registries from configuration
        for (const config of REGISTRY_CONFIG) {
            this[config.name] = new config.class(resourceManager, eventBus);
        }
    }

    // Initialize all registries
    async initializeAll() {
        const initPromises = [];
        
        // Initialize all registries in parallel
        for (const config of REGISTRY_CONFIG) {
            const registry = this[config.name];
            if (registry && typeof registry.initialize === 'function') {
                initPromises.push(registry.initialize());
            }
        }
        
        await Promise.all(initPromises);
        
        this.eventBus.emit('registries:initialized', {
            registries: REGISTRY_CONFIG.map(config => config.name)
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
        return REGISTRY_CONFIG.every(config => {
            const registry = this[config.name];
            return registry && registry.isInitialized();
        });
    }
}


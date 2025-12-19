export class ResourceManager {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.cache = new Map();
        this.loadingPromises = new Map();
    }

    // Load a JSON resource from the data folder
    async load(resourceName) {
        // Return cached data if available
        if (this.cache.has(resourceName)) {
            return this.cache.get(resourceName);
        }

        // Return existing loading promise if already loading
        if (this.loadingPromises.has(resourceName)) {
            return this.loadingPromises.get(resourceName);
        }

        // Start loading
        const loadPromise = this._fetchResource(resourceName);
        this.loadingPromises.set(resourceName, loadPromise);

        try {
            const data = await loadPromise;
            this.cache.set(resourceName, data);
            this.loadingPromises.delete(resourceName);
            
            // Emit event when resource is loaded
            this.eventBus.emit('resource:loaded', { resourceName, data });
            
            return data;
        } catch (error) {
            this.loadingPromises.delete(resourceName);
            this.eventBus.emit('resource:error', { resourceName, error });
            throw error;
        }
    }

    // Fetch resource from data folder
    async _fetchResource(resourceName) {
        const response = await fetch(`/data/${resourceName}.json`);
        
        if (!response.ok) {
            throw new Error(`Failed to load resource: ${resourceName} (${response.status})`);
        }
        
        return await response.json();
    }

    // Get cached resource (returns undefined if not loaded)
    get(resourceName) {
        return this.cache.get(resourceName);
    }

    // Check if resource is loaded
    isLoaded(resourceName) {
        return this.cache.has(resourceName);
    }

    // Clear cache for a specific resource or all resources
    clearCache(resourceName = null) {
        if (resourceName) {
            this.cache.delete(resourceName);
        } else {
            this.cache.clear();
        }
    }
}


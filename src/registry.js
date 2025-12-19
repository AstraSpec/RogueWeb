export class Registry {
    constructor(resourceManager, eventBus, config) {
        this.resourceManager = resourceManager;
        this.eventBus = eventBus;
        this.resourceName = config.resourceName;
        this.dataKey = config.dataKey;
        this.eventPrefix = config.eventPrefix;
        
        this.itemsById = new Map();
        this.initialized = false;
    }

    // Initialize the registry by loading JSON resource
    async initialize() {
        if (this.initialized) {
            return;
        }

        try {
            const data = await this.resourceManager.load(this.resourceName);
            
            if (!data[this.dataKey] || !Array.isArray(data[this.dataKey])) {
                throw new Error(`Invalid ${this.resourceName}.json format: expected "${this.dataKey}" array`);
            }

            // Process each item
            for (const item of data[this.dataKey]) {
                // Validate item structure
                if (!this.validateItem(item)) {
                    console.warn(`Invalid ${this.eventPrefix} definition:`, item);
                    continue;
                }

                // Process item (subclasses can transform if needed)
                const processedItem = this.processItem(item);
                
                // Build lookup maps
                this.buildLookups(processedItem);
            }

            this.initialized = true;
            this.eventBus.emit(`${this.eventPrefix}:loaded`, { count: this.itemsById.size });
        } catch (error) {
            console.error(`Failed to initialize ${this.eventPrefix} registry:`, error);
            this.eventBus.emit(`${this.eventPrefix}:error`, { error });
            throw error;
        }
    }

    // Validate item structure - override in subclasses
    validateItem(item) {
        return item && item.id;
    }

    // Process item before storing - override in subclasses if transformation needed
    processItem(item) {
        return item;
    }

    // Build lookup maps - override in subclasses for custom lookups
    buildLookups(item) {
        this.itemsById.set(item.id, item);
    }

    // Get item by ID
    get(id) {
        return this.itemsById.get(id);
    }

    // Get all item IDs
    getAllIds() {
        return Array.from(this.itemsById.keys());
    }

    // Get all items
    getAll() {
        return Array.from(this.itemsById.values());
    }

    // Check if registry is initialized
    isInitialized() {
        return this.initialized;
    }
}


export class GameState {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.state = {
            running : false,
            paused : false,
            turnsElapsed : 0,

            player : null,
            playerPosition : { x:0, y:0 },

            entityCount : 0,
            entities : new Map(),

            cameraPosition : { x:0, y:0 },
            cameraZoom : 1,

            config : {
                tileSize : 16,
                chunkSize : 32
            }
        }
    }

    get(path, defaultValue = undefined) {
        const keys = path.split('.');
        let value = this.state;
        
        for (const key of keys) {
        if (value === undefined || value === null) {
            return defaultValue;
        }
        value = value[key];
        }
        
        return value !== undefined ? value : defaultValue;
    }
    
    // Set state value (supports dot notation)
    set(path, newValue, silent = false) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = this.state;
        
        // Navigate to parent object
        for (const key of keys) {
        if (!(key in target) || typeof target[key] !== 'object') {
            target[key] = {};
        }
        target = target[key];
        }
        
        const oldValue = target[lastKey];
        
        // Only update if changed
        if (oldValue !== newValue) {
        target[lastKey] = newValue;
        
        if (!silent) {
            // Emit state change event
            this.eventBus.emit('state:changed', {
            path,
            oldValue,
            newValue,
            fullPath: path
            });
        }
        }
    }

    // Update multiple values atomically
    update(updates, silent = false) {
        const changes = [];
        
        for (const [path, value] of Object.entries(updates)) {
        const oldValue = this.get(path);
        this.set(path, value, true);  // Silent update
        changes.push({ path, oldValue, newValue: value });
        }
        
        if (!silent && changes.length > 0) {
        // Emit batch change event
        this.eventBus.emit('state:batchChanged', { changes });
        }
    }

    // Subscribe to state changes
    subscribe(path, callback) {
        return this.eventBus.on('state:changed', (data) => {
        if (data.path === path || data.path.startsWith(path + '.')) {
            callback(data.newValue, data.oldValue, data.path);
        }
        });
    }

    // Get entire state (for serialization)
    getState() {
        return JSON.parse(JSON.stringify(this.state));  // Deep copy
    }

    // Load state (for loading saves)
    loadState(newState) {
        const oldState = this.getState();
        this.state = JSON.parse(JSON.stringify(newState));
        
        this.eventBus.emit('state:loaded', {
        oldState,
        newState: this.getState()
        });
    }

    // Reset to initial state
    reset() {
        const oldState = this.getState();
        // Reinitialize state...
        this.eventBus.emit('state:reset', { oldState });
    }
}
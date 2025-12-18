export class EventBus {
    constructor() {
        this.listeners = new Map();
        this.onceListeners = new Map();
    }

    on(eventType, callback, context=null) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Set());
        }
        const listener = {callback, context};
        this.listeners.get(eventType).add(listener);

        return () => this.off(eventType, listener);
    }

    once(eventType, callback, context = null) {
        if (!this.onceListeners.has(eventType)) {
            this.onceListeners.set(eventType, new Set());
        }
        this.onceListeners.get(eventType).add({callback, context});
    }

    off(eventType, listener) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).delete(listener);
        }
    }

    emit(eventType, data = {}) {
        if (this.listeners.has(eventType)) {
            this.listeners.get(eventType).forEach(listener => {
                try {
                    listener.callback.call(listener.context, data);
                } catch (error) {
                    console.error(`Event handling error: ${eventType}`, error)
                }
            });
        }

        if (this.onceListeners.has(eventType)) {
            const onceSet = this.onceListeners.get(eventType);
            onceSet.forEach(listener => {
                try {
                    listener.callback.call(listener.context, data);
                } catch (error) {
                    console.error(`Event handling error: ${eventType}`, error)
                }
            });
            onceSet.clear();
        }
    }
}

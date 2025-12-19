export class EntityManager {
    constructor(eventBus, gameState) {
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.entities = [];
        this.player = null;
    }

    addEntity(entity) {
        this.entities.push(entity);
        
        // Sync to GameState
        const entityId = entity.id || `entity_${this.entities.length - 1}`;
        if (!entity.id) entity.id = entityId;
        
        this.gameState.state.entities.set(entityId, {
            x: entity.x,
            y: entity.y,
            type: entity.type
        });
        
        this.gameState.set('entityCount', this.entities.length);
        
        return entity;
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            
            // Remove from GameState
            if (entity.id) {
                this.gameState.state.entities.delete(entity.id);
            }
            this.gameState.set('entityCount', this.entities.length);
            
            if (this.player === entity) {
                this.player = null;
                this.gameState.set('player', null);
            }
        }
    }

    getEntity(id) {
        return this.entities.find(e => e.id === id) || this.entities[id];
    }

    getPlayer() {
        return this.player || this.entities[0];
    }

    setPlayer(entity) {
        this.player = entity;
        this.gameState.set('player', entity);
        if (entity) {
            this.gameState.set('playerPosition', { x: entity.x, y: entity.y });
        }
    }
}
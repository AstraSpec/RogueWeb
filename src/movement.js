export class Movement {
    constructor(eventBus, entityManager, map, gameState, registries) {
        this.eventBus = eventBus;
        this.entityManager = entityManager;
        this.map = map;
        this.gameState = gameState;
        this.registries = registries;

        this.eventBus.on('input:move', (data) => {
            const player = this.entityManager.getPlayer();
            if (player) {
                this.attemptMove(player, data.dx, data.dy);
            }
        });
    }

    attemptMove(entity, dx, dy) {
        const x = entity.x + dx;
        const y = entity.y + dy;

        if (this.canMoveTo(x, y)) {
            entity.x = x;
            entity.y = y;

            // Update GameState
            if (entity === this.entityManager.getPlayer()) {
                this.gameState.set('playerPosition', { x, y });
                const turnsElapsed = this.gameState.get('turnsElapsed', 0);
                this.gameState.set('turnsElapsed', turnsElapsed + 1);
            }
            
            // Update entity in GameState entities map
            if (entity.id) {
                const entityData = this.gameState.state.entities.get(entity.id);
                if (entityData) {
                    entityData.x = x;
                    entityData.y = y;
                }
            }

            this.eventBus.emit('entity:moved', { entity, x, y });
        }
        else {
            this.eventBus.emit('movement:blocked', { entity, x, y });
        }
    }

    canMoveTo(x, y) {
        // Check bounds
        if (x < 0 || y < 0 || x >= this.map.size || y >= this.map.size) {
            return false;
        }

        // Check if tile is walkable using TileRegistry
        const tileChar = this.map.getTileChar(x, y);
        if (tileChar && this.registries && this.registries.tiles) {
            if (this.registries.tiles.isSolidByChar(tileChar)) {
                return false;
            }
        } else if (tileChar === '#') {
            return false;
        }

        // Check if another entity is at this position
        const entitiesAtPosition = this.entityManager.entities.filter(
            e => e.x === x && e.y === y
        );
        if (entitiesAtPosition.length > 0) {
            return false;
        }

        return true;
    }
}
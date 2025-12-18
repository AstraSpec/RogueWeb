export class Movement {
    constructor(eventBus, entityManager, map) {
        this.eventBus = eventBus;
        this.entityManager = entityManager;
        this.map = map;

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

        // Check if tile is walkable
        if (this.map.tiles[y][x] === '#') {
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
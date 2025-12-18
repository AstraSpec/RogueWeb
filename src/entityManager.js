export class EntityManager {
    constructor() {
        this.entities = [];
        this.player = null;
    }

    addEntity(entity) {
        this.entities.push(entity);
        return entity;
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
            if (this.player === entity) {
                this.player = null;
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
    }
}
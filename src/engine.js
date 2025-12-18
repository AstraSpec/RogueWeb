import { Entity } from './entity.js';
import { Input } from './input.js';
import { EntityManager } from './entityManager.js';
import { EventBus } from './eventbus.js';
import { Movement } from './movement.js';

export class GameEngine {
    constructor(map) {
        this.map = map;
        this.running = false;
        
        this.eventBus = new EventBus();
        this.entityManager = new EntityManager();
        this.movement = new Movement(this.eventBus, this.entityManager, this.map);
        this.input = new Input(this.eventBus);
    }

    start() {
        const player = new Entity(16, 16, '@');
        const horse = new Entity(16, 18, 'P');
        
        this.entityManager.addEntity(player);
        this.entityManager.addEntity(horse);
        this.entityManager.setPlayer(player);
        
        this.running = true;
        this.eventBus.emit('render:screen', { entity: player });
        this.loop();
    }

    loop() {
        this.update();
        if (this.running) {
            requestAnimationFrame(() => this.loop());
        }
    }

    update() {}
}

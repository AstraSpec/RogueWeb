import { Entity } from './entity.js';
import { Input } from './input.js';
import { EntityManager } from './entityManager.js';
import { EventBus } from './eventbus.js';
import { Movement } from './movement.js';
import { GameState } from './gameState.js';
import { Camera } from './camera.js';

export class GameEngine {
    constructor(map, viewportWidth = 512, viewportHeight = 512) {
        this.map = map;
        
        this.eventBus = new EventBus();
        this.gameState = new GameState(this.eventBus);
        
        this.gameState.set('config.tileSize', 16);
        this.gameState.set('config.chunkSize', 32);
        
        this.entityManager = new EntityManager(this.eventBus, this.gameState);
        this.movement = new Movement(this.eventBus, this.entityManager, this.map, this.gameState);
        this.input = new Input(this.eventBus);
        this.camera = new Camera(this.eventBus, this.gameState, viewportWidth, viewportHeight);
    }

    start() {
        const player = new Entity(16, 16, '@');
        const horse = new Entity(16, 18, 'P');
        
        this.entityManager.addEntity(player);
        this.entityManager.addEntity(horse);
        this.entityManager.setPlayer(player);
        
        this.gameState.set('running', true);
        this.gameState.set('player', player);
        this.gameState.set('playerPosition', { x: player.x, y: player.y });
        this.gameState.set('cameraPosition', { x: player.x, y: player.y });
        this.eventBus.emit('render:screen', { entity: player });
        this.loop();
    }

    loop() {
        this.update();
        if (this.gameState.get('running')) {
            requestAnimationFrame(() => this.loop());
        }
    }

    update() {}
}

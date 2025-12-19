import { Entity } from './entity.js';
import { Input } from './input.js';
import { EntityManager } from './entityManager.js';
import { Movement } from './movement.js';
import { GameState } from './gameState.js';
import { Camera } from './camera.js';

export class GameEngine {
    constructor(map, viewportWidth = 512, viewportHeight = 512, eventBus = null) {
        this.map = map;
        
        this.eventBus = eventBus;
        this.gameState = new GameState(this.eventBus);
        
        this.gameState.set('config.tileSize', 16);
        this.gameState.set('config.chunkSize', 32);
        
        this.resourceManager = null;
        this.registries = null;
        
        this.entityManager = null;
        this.movement = null;
        this.input = new Input(this.eventBus);
        this.camera = new Camera(this.eventBus, this.gameState, viewportWidth, viewportHeight);
    }

    async start() {
        // Registries should already be initialized by main.js
        if (!this.registries) {
            throw new Error('Registries must be initialized before starting game');
        }
        
        // Initialize entity manager with registries
        this.entityManager = new EntityManager(this.eventBus, this.gameState, this.registries);
        
        // Initialize movement with registries
        this.movement = new Movement(this.eventBus, this.entityManager, this.map, this.gameState, this.registries);
        
        // Create entities using registry IDs
        const player = this.entityManager.addEntity('human', 16, 16);
        const dog = this.entityManager.addEntity('dog', 16, 18);
        
        if (player) {
            this.entityManager.setPlayer(player);
        }
        
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

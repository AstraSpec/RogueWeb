import { Entity } from './entity.js';
import { Input } from './input.js';
import { EntityManager } from './entityManager.js';
import { EventBus } from './eventbus.js';
import { Movement } from './movement.js';
import { GameState } from './gameState.js';
import { Camera } from './camera.js';
import { ResourceManager } from './resourceManager.js';
import { RegistryManager } from './registryManager.js';

export class GameEngine {
    constructor(map, viewportWidth = 512, viewportHeight = 512, eventBus = null) {
        this.map = map;
        
        // Use provided eventBus or create new one
        this.eventBus = eventBus || new EventBus();
        this.gameState = new GameState(this.eventBus);
        
        this.gameState.set('config.tileSize', 16);
        this.gameState.set('config.chunkSize', 32);
        
        // ResourceManager and RegistryManager will be set by main.js after initialization
        this.resourceManager = null;
        this.registries = null;
        
        this.entityManager = new EntityManager(this.eventBus, this.gameState);
        this.movement = null; // Will be initialized in start() after registries are set
        this.input = new Input(this.eventBus);
        this.camera = new Camera(this.eventBus, this.gameState, viewportWidth, viewportHeight);
    }

    async start() {
        // Registries should already be initialized by main.js
        if (!this.registries) {
            throw new Error('Registries must be initialized before starting game');
        }
        
        // Initialize movement with registries
        this.movement = new Movement(this.eventBus, this.entityManager, this.map, this.gameState, this.registries);
        
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

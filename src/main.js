import { GameEngine } from './engine.js';
import { Map } from './map.js';
import { Render } from './render.js';
import { EventBus } from './eventbus.js';
import { ResourceManager } from './resourceManager.js';
import { RegistryManager } from './registryManager.js';

async function init() {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    
    // Set up high DPI rendering for crisp text and emojis
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const cssWidth = rect.width || canvas.width;
    const cssHeight = rect.height || canvas.height;
    
    // Set actual size in memory (scaled for DPI)
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    
    // Scale the context to match device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Set CSS size to maintain visual size
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = cssHeight + 'px';

    // Initialize registries first
    const eventBus = new EventBus();
    const resourceManager = new ResourceManager(eventBus);
    const registries = new RegistryManager(resourceManager, eventBus);
    
    // Load all registry data before creating anything else
    await registries.initializeAll();

    // Now create map with initialized tileRegistry
    const map = new Map(32, registries.tiles);
    
    // Create game engine with shared eventBus (use CSS dimensions, not scaled)
    const game = new GameEngine(map, cssWidth, cssHeight, eventBus);
    
    // Set registries on game engine (they're already initialized)
    game.registries = registries;
    game.resourceManager = resourceManager;
    
    // Create render
    const render = new Render(ctx, game.eventBus, game.map, game.entityManager, game.gameState, game.camera, game.registries);

    // Start game
    game.start().catch(error => {
        console.error('Failed to start game:', error);
    });
}

init().catch(error => {
    console.error('Failed to initialize game:', error);
});

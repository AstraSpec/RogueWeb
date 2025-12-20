import { GameEngine } from './engine.js';
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

    const game = new GameEngine(null, cssWidth, cssHeight, eventBus);
    
    game.registries = registries;
    game.resourceManager = resourceManager;
    
    // Create map with gameState reference (needs gameState for chunkSize)
    const map = new GameMap(200, registries.tiles, registries.chunks, game.gameState);
    game.map = map;
    
    // Start game first to create entityManager and entities
    try {
        await game.start();
    } catch (error) {
        console.error('Failed to start game:', error);
        return;
    }
    
    // Create render after entities are created
    const render = new Render(ctx, game.eventBus, game.map, game.entityManager, game.gameState, game.camera, game.registries);
    
    // Create map panel
    const mapPanel = new MapPanel({
        eventBus: eventBus,
        map: game.map,
        registries: registries,
        gameState: game.gameState
    });
    
    // Handle M key to toggle map panel
    window.addEventListener('keydown', (e) => {
        // Only handle if not already handled by input system
        if (e.key === 'm' || e.key === 'M') {
            e.preventDefault();
            mapPanel.toggle();
        }
    });
}

init().catch(error => {
    console.error('Failed to initialize game:', error);
});

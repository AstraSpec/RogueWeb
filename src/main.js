import { GameEngine } from './engine.js';
import { Map } from './map.js';
import { Render } from './render.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const map = new Map(32);
const game = new GameEngine(map);
const render = new Render(ctx, game.eventBus, game.map, game.entityManager);

game.start();

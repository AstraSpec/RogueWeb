import { GameEngine } from './engine.js';
import { Map } from './map.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const map = new Map(32);
const game = new GameEngine(ctx, map);

game.start();

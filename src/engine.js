import { Entity } from './entity.js';

export class GameEngine {
    constructor(ctx, map) {
        this.ctx = ctx;
        this.map = map;
        this.running = false;
    }

    start() {

        
        this.running = true;
        this.loop();
    }

    loop() {
        this.update();
        this.render();
        if (this.running) requestAnimationFrame(() => this.loop());
    }

    update() {
    }

    render() {
        this.ctx.clearRect(0, 0, 512, 512)
        this.map.draw(this.ctx);

    }
}
import { Entity } from './entity.js';

export class GameEngine {
    constructor(ctx, map) {
        this.ctx = ctx;
        this.map = map;
        this.entities = [];
        this.running = false;
    }

    start() {
        const player = new Entity(16, 16, '@');
        const horse = new Entity(16, 18, 'P');
        this.entities.push(player);
        this.entities.push(horse);

        
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

        for (const entity of this.entities) {
            entity.draw(this.ctx);
        }
    }
    }
}
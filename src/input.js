function getDirection(key) {
    switch(key) {
        case 'ArrowUp': case 'w':
            return [0, -1];
        case 'ArrowDown': case 's':
            return [0, 1];
        case 'ArrowLeft': case 'a':
            return [-1, 0];
        case 'ArrowRight': case 'd':
            return [1, 0];
        default: return null;
    }
}

export class Input {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.key = null;
        
        window.addEventListener('keydown', e => {
            if (e.key === this.key) return;
            this.key = e.key;

            const direction = getDirection(this.key);
            if (direction) {
                this.eventBus.emit('input:move', { dx: direction[0], dy: direction[1] });
            }

        });

        window.addEventListener('keyup', e => {
            if (e.key === this.key) {
                this.key = null;
            }
        });

        window.addEventListener('blur', () => {
            this.key = null;
        });
    }
}
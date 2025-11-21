export class Control {
    constructor(onMove) {
        this.onMove = onMove;
        this.controller = null;
        this.lastkey = null;
        
        window.addEventListener('keydown', e => {
            if (e.key === this.lastkey) return;
            this.lastKey = e.key;
            
            let dx = 0, dy = 0;

            switch(e.key) {
                case 'ArrowUp': case 'w':
                    dy = -1; break;
                case 'ArrowDown': case 's':
                    dy = 1; break;
                case 'ArrowLeft': case 'a':
                    dx = -1; break;
                case 'ArrowRight': case 'd':
                    dx = 1; break;
                default: return;
            }

            this.onMove(dx, dy);
        });

        window.addEventListener('keyup', e => {
            if (e.key === this.lastKey) {
                this.lastkey = null;
            }
        });

        window.addEventListener('blur', () => {
            this.lastKey = null;
        });
    }

    setController(entity) {
        this.controller = entity;
    }

    getController() {
        return this.controller;
    }

    switchController() {
        if (this.keys.has('r')) return true;
        return false;
    }
}
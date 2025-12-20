import { UIElement } from './UIElement.js';

/**
 * Panel UI element - a basic panel with a close button
 * Extends UIElement base class
 */
export class Panel extends UIElement {
    constructor(options = {}) {
        super(options);
        
        this.width = options.width || '400px';
        this.height = options.height || '300px';
        this.position = options.position || 'center'; // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        this.showCloseButton = options.showCloseButton !== false; // Default to true
        
        this.closeButton = null;
        
        this.setupPanel();
    }
    
    /**
     * Sets up the panel structure
     */
    setupPanel() {
        if (!this.element) return;
        
        // Add panel class
        this.addClass('ui-panel');
        
        // Set panel dimensions
        this.setStyle('width', this.width);
        this.setStyle('height', this.height);
        
        // Set position
        this.setPosition(this.position);
        
        // Create close button if enabled
        if (this.showCloseButton) {
            this.createCloseButton();
        }
    }
    
    /**
     * Sets the position of the panel
     */
    setPosition(position) {
        if (!this.element) return;
        
        // Reset positioning
        this.setStyle('left', 'auto');
        this.setStyle('right', 'auto');
        this.setStyle('top', 'auto');
        this.setStyle('bottom', 'auto');
        this.setStyle('transform', 'none');
        
        switch (position) {
            case 'center':
                this.setStyle('left', '50%');
                this.setStyle('top', '50%');
                this.setStyle('transform', 'translate(-50%, -50%)');
                break;
            case 'top-left':
                this.setStyle('left', '20px');
                this.setStyle('top', '20px');
                break;
            case 'top-right':
                this.setStyle('right', '20px');
                this.setStyle('top', '20px');
                break;
            case 'bottom-left':
                this.setStyle('left', '20px');
                this.setStyle('bottom', '20px');
                break;
            case 'bottom-right':
                this.setStyle('right', '20px');
                this.setStyle('bottom', '20px');
                break;
            default:
                // Default to center
                this.setStyle('left', '50%');
                this.setStyle('top', '50%');
                this.setStyle('transform', 'translate(-50%, -50%)');
        }
    }
    
    /**
     * Creates the close button (X) in the top right corner
     */
    createCloseButton() {
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'ui-panel-close';
        this.closeButton.innerHTML = '×';
        this.closeButton.setAttribute('aria-label', 'Close panel');
        
        // Position the close button
        this.closeButton.style.position = 'absolute';
        this.closeButton.style.top = '10px';
        this.closeButton.style.right = '10px';
        this.closeButton.style.width = '30px';
        this.closeButton.style.height = '30px';
        this.closeButton.style.border = 'none';
        this.closeButton.style.background = 'transparent';
        this.closeButton.style.cursor = 'pointer';
        this.closeButton.style.fontSize = '24px';
        this.closeButton.style.lineHeight = '1';
        this.closeButton.style.color = '#fff';
        this.closeButton.style.padding = '0';
        this.closeButton.style.display = 'flex';
        this.closeButton.style.alignItems = 'center';
        this.closeButton.style.justifyContent = 'center';
        
        // Add hover effect
        this.closeButton.addEventListener('mouseenter', () => {
            this.closeButton.style.color = '#ff4444';
            this.closeButton.style.transform = 'scale(1.1)';
        });
        
        this.closeButton.addEventListener('mouseleave', () => {
            this.closeButton.style.color = '#fff';
            this.closeButton.style.transform = 'scale(1)';
        });
        
        // Add click handler to close the panel
        this.closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.close();
        });
        
        this.element.appendChild(this.closeButton);
    }
    
    /**
     * Override show to ensure close button is visible
     */
    show() {
        super.show();
        if (this.closeButton && this.showCloseButton) {
            this.closeButton.style.display = 'flex';
        }
    }
    
    /**
     * Sets the content of the panel
     */
    setContent(content) {
        if (!this.element) return;
        
        // Remove existing content (except close button)
        const closeButton = this.element.querySelector('.ui-panel-close');
        this.element.innerHTML = '';
        
        // Re-add close button if it exists
        if (closeButton) {
            this.element.appendChild(closeButton);
            this.closeButton = closeButton;
        }
        
        // Add content
        if (typeof content === 'string') {
            this.element.insertAdjacentHTML('beforeend', content);
        } else if (content instanceof HTMLElement) {
            this.element.appendChild(content);
        }
    }
}


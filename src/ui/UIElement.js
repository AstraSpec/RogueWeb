/**
 * Base class for all UI elements
 * Provides common functionality for UI components
 */
export class UIElement {
    constructor(options = {}) {
        this.id = options.id || `ui-element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.element = null;
        this.isVisible = options.visible !== false; // Default to visible
        this.zIndex = options.zIndex || 1000;
        this.onClose = options.onClose || null;
        
        this.createElement();
        if (this.isVisible) {
            this.show();
        }
    }
    
    /**
     * Creates the DOM element for this UI element
     * Should be overridden by subclasses
     */
    createElement() {
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.element.className = 'ui-element';
        this.element.style.position = 'fixed';
        this.element.style.zIndex = this.zIndex;
    }
    
    /**
     * Shows the UI element
     */
    show() {
        if (this.element && !this.isVisible) {
            document.body.appendChild(this.element);
            this.isVisible = true;
        }
    }
    
    /**
     * Hides the UI element
     */
    hide() {
        if (this.element && this.isVisible) {
            this.element.remove();
            this.isVisible = false;
        }
    }
    
    /**
     * Closes and removes the UI element
     */
    close() {
        if (this.onClose) {
            this.onClose();
        }
        this.hide();
        this.element = null;
    }
    
    /**
     * Toggles visibility of the UI element
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Gets the DOM element
     */
    getElement() {
        return this.element;
    }
    
    /**
     * Sets a CSS style on the element
     */
    setStyle(property, value) {
        if (this.element) {
            this.element.style[property] = value;
        }
    }
    
    /**
     * Adds a CSS class to the element
     */
    addClass(className) {
        if (this.element) {
            this.element.classList.add(className);
        }
    }
    
    /**
     * Removes a CSS class from the element
     */
    removeClass(className) {
        if (this.element) {
            this.element.classList.remove(className);
        }
    }
}


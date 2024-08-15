export class EventDispatcher {
    
    events: { [key: string]: EventListener[] };
    // eventType: string;

    constructor() {
        this.events = {};
    }

    // Add an event listener
    addEventListener(eventType: string, callback: EventListener) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        this.events[eventType].push(callback);
        document.addEventListener(eventType, callback);
    }

    // Remove an event listener
    removeEventListener(eventType: any, callback: EventListener) {
        if (!this.events[eventType]) return;

        const index = this.events[eventType].indexOf(callback);
        if (index !== -1) {
            this.events[eventType].splice(index, 1);
            document.removeEventListener(eventType, callback);
        }
    }

    // Remove all event listeners of a specific type
    removeAllEventListeners(eventType: string) {
        if (!this.events[eventType]) return;

        this.events[eventType].forEach(callback => {
            document.removeEventListener(eventType, callback);
        });
        delete this.events[eventType];
    }

    // Remove all event listeners
    dispose() {
        for (const eventType in this.events) {
            this.removeAllEventListeners(eventType);
        }
    
    }
}

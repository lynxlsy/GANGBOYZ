// Event Manager for Gang Boyz E-commerce
// This file manages all custom events to prevent performance issues

type EventCallback = (data?: any) => void;

class EventManager {
  private static instance: EventManager;
  private events: Map<string, Set<EventCallback>> = new Map();
  private pendingEvents: Map<string, any[]> = new Map();
  private debounceTimers: Map<string, NodeJS.Timeout> = new Map();
  private lastEmitTimes: Map<string, number> = new Map();

  private constructor() {}

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager();
    }
    return EventManager.instance;
  }

  // Subscribe to an event
  public subscribe(event: string, callback: EventCallback): void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)?.add(callback);
  }

  // Unsubscribe from an event
  public unsubscribe(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }

  // Emit an event with optional data
  public emit(event: string, data?: any): void {
    // Special throttling for forceProductsReload to prevent excessive calls
    if (event === 'forceProductsReload') {
      const now = Date.now();
      const lastEmit = this.lastEmitTimes.get(event) || 0;
      
      // Only allow forceProductsReload to be emitted once every 1000ms (increased from 500ms)
      if (now - lastEmit < 1000) {
        return;
      }
      
      this.lastEmitTimes.set(event, now);
    }
    
    // Special throttling for editableContentsUpdated to prevent excessive calls
    if (event === 'editableContentsUpdated') {
      const now = Date.now();
      const lastEmit = this.lastEmitTimes.get(event) || 0;
      
      // Only allow editableContentsUpdated to be emitted once every 500ms
      if (now - lastEmit < 500) {
        return;
      }
      
      this.lastEmitTimes.set(event, now);
    }
    
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  // Emit an event with debouncing to prevent excessive calls
  public emitDebounced(event: string, data?: any, delay: number = 300): void {
    // Clear existing timer for this event
    if (this.debounceTimers.has(event)) {
      clearTimeout(this.debounceTimers.get(event)!);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.emit(event, data);
      this.debounceTimers.delete(event);
    }, delay);

    this.debounceTimers.set(event, timer);
  }

  // Emit an event with throttling to limit frequency
  public emitThrottled(event: string, data?: any, delay: number = 500): void {
    const now = Date.now();
    const lastEmit = this.pendingEvents.get(event)?.[0] || 0;

    if (now - lastEmit >= delay) {
      this.emit(event, data);
      this.pendingEvents.set(event, [now, data]);
    } else {
      // Update pending data
      this.pendingEvents.set(event, [lastEmit, data]);
      
      // Schedule emission if not already scheduled
      if (!this.debounceTimers.has(event)) {
        const timer = setTimeout(() => {
          const pending = this.pendingEvents.get(event);
          if (pending) {
            this.emit(event, pending[1]);
            this.pendingEvents.delete(event);
          }
          this.debounceTimers.delete(event);
        }, delay - (now - lastEmit));
        
        this.debounceTimers.set(event, timer);
      }
    }
  }

  // Clear all pending events and timers
  public clear(): void {
    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();
    this.pendingEvents.clear();
    this.lastEmitTimes.clear();
  }
}

// Create singleton instance
export const eventManager = EventManager.getInstance();

// Backward compatibility functions
export const addEventListener = (event: string, callback: EventCallback): void => {
  eventManager.subscribe(event, callback);
};

export const removeEventListener = (event: string, callback: EventCallback): void => {
  eventManager.unsubscribe(event, callback);
};

export const dispatchEvent = (event: string, data?: any): void => {
  eventManager.emitDebounced(event, data, 300); // Increased debounce delay
};

export default eventManager;
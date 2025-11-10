// Idle Callback Utility for Gang Boyz E-commerce
// This file provides a polyfill for requestIdleCallback and implements utility functions

// Polyfill for requestIdleCallback
export const requestIdleCallback = 
  typeof window !== 'undefined' && window.requestIdleCallback
    ? window.requestIdleCallback
    : (callback: IdleRequestCallback, options?: IdleRequestOptions) => {
        const start = Date.now()
        const timeout = options?.timeout || 1000
        
        return setTimeout(() => {
          callback({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
          })
        }, 0) as any
      }

// Polyfill for cancelIdleCallback
export const cancelIdleCallback = 
  typeof window !== 'undefined' && window.cancelIdleCallback
    ? window.cancelIdleCallback
    : (id: number) => clearTimeout(id)

// Utility function to run a task during idle time
export function runDuringIdle<T>(task: () => T, timeout?: number): Promise<T> {
  return new Promise((resolve, reject) => {
    requestIdleCallback((deadline) => {
      if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
        try {
          const result = task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      } else {
        // If not enough time, reschedule with a longer timeout
        setTimeout(() => {
          runDuringIdle(task, timeout).then(resolve).catch(reject)
        }, 100)
      }
    }, { timeout: timeout || 2000 }) // Increased default timeout
  })
}

// Utility function to run multiple tasks during idle time
export function runTasksDuringIdle<T>(tasks: (() => T)[], timeout?: number): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = []
    let index = 0
    
    const executeNext = () => {
      if (index >= tasks.length) {
        resolve(results)
        return
      }
      
      requestIdleCallback((deadline) => {
        try {
          // Execute as many tasks as possible during this idle period
          while (index < tasks.length && (deadline.timeRemaining() > 10 || deadline.didTimeout)) {
            const result = tasks[index]()
            results.push(result)
            index++
          }
          
          if (index < tasks.length) {
            // Schedule next batch with a small delay to prevent blocking
            setTimeout(executeNext, 50)
          } else {
            // All tasks completed
            resolve(results)
          }
        } catch (error) {
          reject(error)
        }
      }, { timeout: timeout || 2000 })
    }
    
    executeNext()
  })
}

// Utility function to debounce a task using idle callback
export function debounceIdle<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 500 // Increased default delay
): (...args: Parameters<T>) => void {
  let timeoutId: number | undefined
  
  return function (...args: Parameters<T>) {
    if (timeoutId) {
      cancelIdleCallback(timeoutId)
    }
    
    timeoutId = requestIdleCallback(() => {
      func(...args)
    }, { timeout: delay }) as any
  }
}

// Utility function to run a task with a fallback timeout
export function runWithIdleFallback<T>(
  idleTask: () => T,
  fallbackTask: () => T,
  idleTimeout: number = 2000 // Increased timeout
): Promise<T> {
  return new Promise((resolve) => {
    const idleId = requestIdleCallback((deadline) => {
      if (deadline.timeRemaining() > 0 || deadline.didTimeout) {
        try {
          const result = idleTask()
          resolve(result)
        } catch (error) {
          resolve(fallbackTask())
        }
      } else {
        resolve(fallbackTask())
      }
    }, { timeout: idleTimeout })
    
    // Fallback timeout
    setTimeout(() => {
      cancelIdleCallback(idleId)
      resolve(fallbackTask())
    }, idleTimeout + 200) // Increased fallback timeout
  })
}

export default {
  requestIdleCallback,
  cancelIdleCallback,
  runDuringIdle,
  runTasksDuringIdle,
  debounceIdle,
  runWithIdleFallback
}
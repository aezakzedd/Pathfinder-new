/**
 * Debounce utility function for performance optimization
 * Particularly useful for map pan/zoom events on Raspberry Pi
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The delay in milliseconds
 * @param {boolean} immediate - Whether to execute on the leading edge
 * @returns {Function} - The debounced function
 */
export function debounce(func, wait = 150, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

/**
 * Throttle utility function - limits execution to once per time period
 * Better for continuous events like scrolling
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - The throttled function
 */
export function throttle(func, limit = 150) {
  let inThrottle;
  
  return function(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export default debounce;

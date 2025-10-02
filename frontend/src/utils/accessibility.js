/**
 * Accessibility utilities and helpers
 */

/**
 * Focus management utilities
 */
export const focusManagement = {
  // Trap focus within a container
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
      
      if (e.key === 'Escape') {
        container.dispatchEvent(new CustomEvent('closeFocusTrap'));
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  // Restore focus to previous element
  restoreFocus: (previousElement) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  },

  // Get focusable elements within container
  getFocusableElements: (container) => {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }
};

/**
 * ARIA utilities
 */
export const ariaUtils = {
  // Generate unique IDs for aria-labelledby, aria-describedby
  generateId: (prefix = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Announce text to screen readers
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  // Set aria attributes dynamically
  setAttributes: (element, attributes) => {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === null) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value);
      }
    });
  }
};

/**
 * Keyboard navigation utilities
 */
export const keyboardNavigation = {
  // Handle arrow key navigation in lists
  handleArrowKeys: (e, items, currentIndex, onNavigate) => {
    let newIndex = currentIndex;
    
    switch (e.key) {
      case 'ArrowUp':
        newIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        e.preventDefault();
        break;
      case 'ArrowDown':
        newIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        e.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        e.preventDefault();
        break;
      case 'End':
        newIndex = items.length - 1;
        e.preventDefault();
        break;
      default:
        return;
    }
    
    onNavigate(newIndex);
    items[newIndex]?.focus();
  },

  // Handle Enter and Space key activation
  handleActivation: (e, onActivate) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onActivate();
    }
  }
};

/**
 * Screen reader utilities
 */
export const screenReader = {
  // Check if user prefers reduced motion
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Check if user is using screen reader (heuristic)
  isScreenReaderActive: () => {
    // This is a heuristic check - not 100% accurate
    return window.navigator.userAgent.includes('NVDA') || 
           window.navigator.userAgent.includes('JAWS') || 
           window.speechSynthesis?.speaking;
  },

  // Create visually hidden text for screen readers
  createVisuallyHiddenText: (text) => {
    const span = document.createElement('span');
    span.className = 'sr-only';
    span.textContent = text;
    return span;
  }
};

/**
 * Color contrast utilities
 */
export const colorContrast = {
  // Calculate luminance of a color
  getLuminance: (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio between two colors
  getContrastRatio: (color1, color2) => {
    const lum1 = colorContrast.getLuminance(...color1);
    const lum2 = colorContrast.getLuminance(...color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  // Check if colors meet WCAG AA standards
  meetsWCAGAA: (color1, color2) => {
    return colorContrast.getContrastRatio(color1, color2) >= 4.5;
  },

  // Check if colors meet WCAG AAA standards
  meetsWCAGAAA: (color1, color2) => {
    return colorContrast.getContrastRatio(color1, color2) >= 7;
  }
};

/**
 * Form accessibility utilities
 */
export const formAccessibility = {
  // Add proper labels and descriptions to form fields
  enhanceFormField: (field, labelText, descriptionText = '') => {
    const fieldId = field.id || ariaUtils.generateId('field');
    field.id = fieldId;

    // Create or update label
    let label = document.querySelector(`label[for="${fieldId}"]`);
    if (!label) {
      label = document.createElement('label');
      label.setAttribute('for', fieldId);
      field.parentNode.insertBefore(label, field);
    }
    label.textContent = labelText;

    // Create description if provided
    if (descriptionText) {
      const descId = `${fieldId}-desc`;
      let description = document.getElementById(descId);
      if (!description) {
        description = document.createElement('div');
        description.id = descId;
        description.className = 'field-description';
        field.parentNode.insertBefore(description, field.nextSibling);
      }
      description.textContent = descriptionText;
      field.setAttribute('aria-describedby', descId);
    }
  },

  // Add error message to field
  addErrorMessage: (field, errorMessage) => {
    const fieldId = field.id;
    const errorId = `${fieldId}-error`;
    
    // Remove existing error
    const existingError = document.getElementById(errorId);
    if (existingError) {
      existingError.remove();
    }

    if (errorMessage) {
      const errorElement = document.createElement('div');
      errorElement.id = errorId;
      errorElement.className = 'field-error';
      errorElement.setAttribute('role', 'alert');
      errorElement.textContent = errorMessage;
      
      field.parentNode.insertBefore(errorElement, field.nextSibling);
      
      const describedBy = field.getAttribute('aria-describedby');
      field.setAttribute('aria-describedby', describedBy ? `${describedBy} ${errorId}` : errorId);
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }
};

/**
 * Live region utilities for dynamic content
 */
export const liveRegions = {
  // Create a live region for announcements
  createLiveRegion: (level = 'polite') => {
    const region = document.createElement('div');
    region.setAttribute('aria-live', level);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
    return region;
  },

  // Update live region content
  updateLiveRegion: (region, message) => {
    // Clear first to ensure announcement
    region.textContent = '';
    setTimeout(() => {
      region.textContent = message;
    }, 100);
  }
};
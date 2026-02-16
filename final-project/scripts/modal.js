// Modal Module
// Handles modal dialog functionality with accessibility features

let modal = null;
let modalContent = null;
let modalClose = null;

/**
 * Initialize modal functionality
 */
export function initModal() {
  modal = document.getElementById('course-modal') || document.getElementById('instructor-modal');
  
  if (!modal) return;
  
  modalContent = modal.querySelector('.modal-content');
  modalClose = modal.querySelector('.modal-close');
  
  // Close button click
  if (modalClose) {
    modalClose.addEventListener('click', hideModal);
  }
  
  // Click outside modal to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });
  
  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      hideModal();
    }
  });
  
  // Trap focus inside modal
  modal.addEventListener('keydown', trapFocus);
}

/**
 * Show modal
 */
export function showModal() {
  if (!modal) return;
  
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Focus first focusable element
  setTimeout(() => {
    const focusable = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  }, 100);
}

/**
 * Hide modal
 */
export function hideModal() {
  if (!modal) return;
  
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  
  // Restore body scroll
  document.body.style.overflow = '';
}

/**
 * Trap focus inside modal for accessibility
 * @param {KeyboardEvent} e - Keyboard event
 */
function trapFocus(e) {
  if (e.key !== 'Tab') return;
  
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];
  
  if (e.shiftKey) {
    // Shift + Tab
    if (document.activeElement === firstFocusable) {
      lastFocusable.focus();
      e.preventDefault();
    }
  } else {
    // Tab
    if (document.activeElement === lastFocusable) {
      firstFocusable.focus();
      e.preventDefault();
    }
  }
}

/**
 * Set modal content
 * @param {string} content - HTML content
 */
export function setModalContent(content) {
  const modalBody = document.getElementById('modal-body');
  if (modalBody) {
    modalBody.innerHTML = content;
  }
}
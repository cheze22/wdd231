// ============================================
// JOIN.JS - Membership Form Handler
// ============================================

// Set timestamp when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current timestamp
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        timestampField.value = new Date().toISOString();
    }
    
    // Update footer year and last modified
    updateFooter();
    
    // Initialize hamburger menu
    initHamburgerMenu();
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.showModal();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.close();
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'DIALOG') {
        event.target.close();
    }
});

// Hamburger Menu
function initHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
}

// Update Footer Information
function updateFooter() {
    // Current Year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Last Modified Date
    const lastModifiedElement = document.getElementById('lastModified');
    if (lastModifiedElement) {
        lastModifiedElement.textContent = `Last Modified: ${document.lastModified}`;
    }
}

// Form Validation Enhancement (optional)
const form = document.getElementById('membershipForm');
if (form) {
    form.addEventListener('submit', function(event) {
        // Additional validation can be added here if needed
        console.log('Form submitted successfully');
    });
}
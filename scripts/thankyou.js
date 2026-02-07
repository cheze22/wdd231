// ============================================
// THANKYOU.JS - Display Form Data
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Display form data from URL parameters
    displayFormData();
    
    // Update footer
    updateFooter();
    
    // Initialize hamburger menu
    initHamburgerMenu();
});

// Get URL Parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        fname: params.get('fname') || 'N/A',
        lname: params.get('lname') || 'N/A',
        email: params.get('email') || 'N/A',
        phone: params.get('phone') || 'N/A',
        organization: params.get('organization') || 'N/A',
        timestamp: params.get('timestamp') || 'N/A'
    };
}

// Display Form Data
function displayFormData() {
    const data = getUrlParams();
    
    // Display Name
    const nameElement = document.getElementById('displayName');
    if (nameElement) {
        nameElement.textContent = `${data.fname} ${data.lname}`;
    }
    
    // Display Email
    const emailElement = document.getElementById('displayEmail');
    if (emailElement) {
        emailElement.textContent = data.email;
    }
    
    // Display Phone
    const phoneElement = document.getElementById('displayPhone');
    if (phoneElement) {
        phoneElement.textContent = data.phone;
    }
    
    // Display Organization
    const orgElement = document.getElementById('displayOrganization');
    if (orgElement) {
        orgElement.textContent = data.organization;
    }
    
    // Display Timestamp (formatted)
    const timestampElement = document.getElementById('displayTimestamp');
    if (timestampElement) {
        const date = new Date(data.timestamp);
        const formattedDate = date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        timestampElement.textContent = formattedDate;
    }
}

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

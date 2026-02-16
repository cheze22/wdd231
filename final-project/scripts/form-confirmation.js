// Form Confirmation Page JavaScript Module
// Displays submitted form data from URL parameters

import { getUrlParameter, formatDate } from './utils.js';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  displayFormData();
  updateFooter();
});

// Navigation
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// Display form data from URL parameters
function displayFormData() {
  const formDataList = document.getElementById('form-data-list');
  
  if (!formDataList) return;
  
  // Get all URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlParams.entries());
  
  if (Object.keys(params).length === 0) {
    formDataList.innerHTML = '<p>No form data submitted.</p>';
    return;
  }
  
  // Format parameter names for display
  const formattedData = formatFormData(params);
  
  // Generate HTML using template literals
  const dataHTML = formattedData.map(item => `
    <dt>${item.label}</dt>
    <dd>${item.value}</dd>
  `).join('');
  
  formDataList.innerHTML = dataHTML;
}

// Format form data for display
function formatFormData(params) {
  const formatted = [];
  
  // Map of parameter names to display labels
  const labelMap = {
    // Newsletter form
    email: 'Email Address',
    consent: 'Marketing Consent',
    
    // Contact form
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone Number',
    interest: 'Area of Interest',
    message: 'Message',
    contactMethod: 'Preferred Contact Method',
    newsletter: 'Newsletter Subscription',
    
    // Instructor application form
    country: 'Country',
    expertise: 'Area of Expertise',
    experience: 'Years of Experience',
    teachingExperience: 'Teaching Experience',
    linkedin: 'LinkedIn Profile',
    website: 'Personal Website',
    courseTopic: 'Proposed Course Topic',
    bio: 'Biography',
    referral: 'How Did You Hear About Us',
    terms: 'Terms Agreement',
    updates: 'Platform Updates',
    
    // Common
    timestamp: 'Submission Time'
  };
  
  // Process each parameter
  for (const [key, value] of Object.entries(params)) {
    const label = labelMap[key] || formatLabel(key);
    const formattedValue = formatValue(key, value);
    
    formatted.push({
      label,
      value: formattedValue
    });
  }
  
  return formatted;
}

// Format parameter label
function formatLabel(key) {
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

// Format parameter value based on type
function formatValue(key, value) {
  // Boolean values
  if (value === 'on' || value === 'true') {
    return '✓ Yes';
  }
  
  if (value === 'false' || value === '') {
    return '✗ No';
  }
  
  // Timestamp
  if (key === 'timestamp') {
    try {
      return formatDate(value);
    } catch {
      return value;
    }
  }
  
  // Email
  if (key === 'email') {
    return `<a href="mailto:${value}">${value}</a>`;
  }
  
  // URLs
  if (key === 'linkedin' || key === 'website') {
    return value ? `<a href="${value}" target="_blank" rel="noopener">${value}</a>` : 'Not provided';
  }
  
  // Phone
  if (key === 'phone') {
    return value ? `<a href="tel:${value}">${value}</a>` : 'Not provided';
  }
  
  // Multi-line text (bio, message)
  if (key === 'bio' || key === 'message') {
    return `<p style="white-space: pre-wrap;">${value}</p>`;
  }
  
  // Default
  return value || 'Not provided';
}

// Update footer
function updateFooter() {
  const currentYearSpan = document.getElementById('current-year');
  const lastModifiedSpan = document.getElementById('last-modified');
  
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
  
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
  }
}

// Add celebration animation on successful submission
window.addEventListener('load', () => {
  const successIcon = document.querySelector('.success-icon');
  if (successIcon) {
    setTimeout(() => {
      successIcon.style.animation = 'pulse 1s ease-in-out';
    }, 500);
  }
});
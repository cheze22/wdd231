// Main JavaScript Module for LearnHub Index Page
// Uses ES Modules, Fetch API, Local Storage, DOM Manipulation, Event Handling

import { formatPrice, formatNumber, animateCounter } from './utils.js';
import { showModal, hideModal, initModal } from './modal.js';

// State management
let allCourses = [];
let filteredCourses = [];
let currentFilter = 'all';

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initModal();
  await loadCourses();
  initFilters();
  updateFooter();
  loadUserPreferences();
  animateStats();
  initNewsletterForm();
});

// Navigation functionality
function initNavigation() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });

    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// Load courses from JSON with error handling
async function loadCourses() {
  try {
    const response = await fetch('data/data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    allCourses = data.courses;
    filteredCourses = allCourses.slice(0, 6); // Show first 6 on homepage
    
    displayCourses(filteredCourses);
    
  } catch (error) {
    console.error('Error loading courses:', error);
    displayErrorMessage();
  }
}

// Display courses dynamically
function displayCourses(courses) {
  const container = document.getElementById('courses-container');
  
  if (!container) return;
  
  if (courses.length === 0) {
    container.innerHTML = '<p class="no-results">No courses found.</p>';
    return;
  }
  
  // Use template literals and map for efficient rendering
  const coursesHTML = courses.map(course => `
    <article class="course-card" data-course-id="${course.id}" role="button" tabindex="0">
      <img src="${course.image}" alt="${course.title}" loading="lazy" width="400" height="200">
      <div class="course-card-content">
        <span class="course-category">${course.category}</span>
        <h3>${course.title}</h3>
        <p>${truncateText(course.description, 100)}</p>
        <div class="course-meta">
          <span>⏱ ${course.duration} hours</span>
          <span>📚 ${course.lessonsCount} lessons</span>
          <span>👥 ${formatNumber(course.studentsEnrolled)} students</span>
        </div>
        <div class="course-footer">
          <div class="course-price">$${formatPrice(course.price)}</div>
          <div class="course-rating">
            <span>⭐ ${course.rating}</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');
  
  container.innerHTML = coursesHTML;
  
  // Add event listeners to course cards
  const courseCards = container.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    card.addEventListener('click', handleCourseClick);
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCourseClick(e);
    });
  });
}

// Handle course card click - show modal
function handleCourseClick(e) {
  const card = e.currentTarget;
  const courseId = card.dataset.courseId;
  const course = allCourses.find(c => c.id === courseId);
  
  if (course) {
    showCourseModal(course);
  }
}

// Show course details in modal
function showCourseModal(course) {
  const modalBody = document.getElementById('modal-body');
  
  const modalHTML = `
    <div class="course-modal-content">
      <img src="${course.image}" alt="${course.title}" width="800" height="400">
      <span class="course-category">${course.category}</span>
      <h2 id="modal-title">${course.title}</h2>
      <div class="course-meta">
        <span>⏱ ${course.duration} hours</span>
        <span>📚 ${course.lessonsCount} lessons</span>
        <span>📊 ${course.level}</span>
        <span>⭐ ${course.rating} (${formatNumber(course.studentsEnrolled)} students)</span>
      </div>
      <p>${course.description}</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        ${course.whatYouWillLearn.map(item => `<li>${item}</li>`).join('')}
      </ul>
      
      <h3>Skills You'll Gain</h3>
      <div class="skills-tags">
        ${course.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      
      <h3>Instructor</h3>
      <p><strong>${course.instructor.name}</strong> - ${course.instructor.title}</p>
      
      <div class="modal-footer">
        <div class="price-info">
          <span class="original-price">$${formatPrice(course.originalPrice)}</span>
          <span class="current-price">$${formatPrice(course.price)}</span>
        </div>
        <button class="btn btn-primary btn-large" onclick="alert('Enrollment feature coming soon!')">Enroll Now</button>
      </div>
    </div>
  `;
  
  modalBody.innerHTML = modalHTML;
  showModal();
  
  // Save viewed course to local storage
  saveViewedCourse(course.id);
}

// Initialize filter buttons
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const category = e.target.dataset.category;
      
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Filter courses
      filterCourses(category);
    });
  });
}

// Filter courses by category
function filterCourses(category) {
  currentFilter = category;
  
  if (category === 'all') {
    filteredCourses = allCourses.slice(0, 6);
  } else {
    filteredCourses = allCourses.filter(course => course.category === category).slice(0, 6);
  }
  
  displayCourses(filteredCourses);
  
  // Save filter preference to local storage
  localStorage.setItem('preferredCategory', category);
}

// Animate statistics counters
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.count);
    animateCounter(stat, target, 2000);
  });
}

// Newsletter form handling
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const consent = document.getElementById('consent').checked;
      
      if (email && consent) {
        // Save to local storage
        saveNewsletterSubscription(email);
        
        // Redirect to confirmation page
        const timestamp = new Date().toISOString();
        window.location.href = `form-confirmation.html?email=${encodeURIComponent(email)}&consent=${consent}&timestamp=${timestamp}`;
      }
    });
  }
}

// Save newsletter subscription to local storage
function saveNewsletterSubscription(email) {
  const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
  
  if (!subscriptions.includes(email)) {
    subscriptions.push(email);
    localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
  }
}

// Save viewed course to local storage
function saveViewedCourse(courseId) {
  const viewedCourses = JSON.parse(localStorage.getItem('viewedCourses') || '[]');
  
  if (!viewedCourses.includes(courseId)) {
    viewedCourses.push(courseId);
    localStorage.setItem('viewedCourses', JSON.stringify(viewedCourses));
  }
}

// Load user preferences from local storage
function loadUserPreferences() {
  const preferredCategory = localStorage.getItem('preferredCategory');
  
  if (preferredCategory && preferredCategory !== 'all') {
    const filterBtn = document.querySelector(`[data-category="${preferredCategory}"]`);
    if (filterBtn) {
      filterBtn.click();
    }
  }
}

// Update footer with current year and last modified
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

// Display error message
function displayErrorMessage() {
  const container = document.getElementById('courses-container');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <p>Unable to load courses. Please try again later.</p>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `;
  }
}

// Utility function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Export functions for use in other modules
export { allCourses, filteredCourses };
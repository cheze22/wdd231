// Courses Page JavaScript Module
// Handles course listing, filtering, sorting, and search

import { formatPrice, formatNumber, debounce, filterBySearch, sortBy, saveToLocalStorage, loadFromLocalStorage } from './utils.js';
import { showModal, hideModal, initModal } from './modal.js';

// State
let allCourses = [];
let filteredCourses = [];
let currentView = 'grid';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initModal();
  await loadCourses();
  initFilters();
  initSearch();
  initViewToggle();
  initSort();
  updateFooter();
  initContactForm();
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

// Load courses with try-catch
async function loadCourses() {
  const loadingIndicator = document.getElementById('loading-indicator');
  const coursesGrid = document.getElementById('courses-grid');
  
  try {
    const response = await fetch('data/data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    allCourses = data.courses;
    filteredCourses = [...allCourses];
    
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    
    displayCourses(filteredCourses);
    updateCourseCount(filteredCourses.length);
    
  } catch (error) {
    console.error('Error loading courses:', error);
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    if (coursesGrid) {
      coursesGrid.innerHTML = `
        <div class="error-message">
          <p>Unable to load courses. Please try again later.</p>
          <button class="btn btn-primary" onclick="location.reload()">Retry</button>
        </div>
      `;
    }
  }
}

// Display courses (generates 15+ items dynamically)
function displayCourses(courses) {
  const container = document.getElementById('courses-grid');
  const noResults = document.getElementById('no-results');
  
  if (!container) return;
  
  if (courses.length === 0) {
    container.style.display = 'none';
    if (noResults) noResults.style.display = 'flex';
    return;
  }
  
  container.style.display = currentView === 'grid' ? 'grid' : 'flex';
  if (noResults) noResults.style.display = 'none';
  
  // Use map and template literals for efficient rendering
  const coursesHTML = courses.map(course => {
    const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
    
    return `
      <article class="course-card" data-course-id="${course.id}" role="button" tabindex="0">
        <img src="${course.image}" alt="${course.title}" loading="lazy" width="400" height="200">
        <div class="course-card-content">
          <span class="course-category">${course.category}</span>
          <h3>${course.title}</h3>
          <p>${course.description.substring(0, 120)}...</p>
          <div class="course-meta">
            <span>⏱ ${course.duration}h</span>
            <span>📚 ${course.lessonsCount} lessons</span>
            <span>📊 ${course.level}</span>
            <span>👥 ${formatNumber(course.studentsEnrolled)}</span>
          </div>
          <div class="course-footer">
            <div class="course-price">
              <span class="current-price">$${formatPrice(course.price)}</span>
              <span class="discount-badge">-${discount}%</span>
            </div>
            <div class="course-rating">
              <span>⭐ ${course.rating}</span>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join('');
  
  container.innerHTML = coursesHTML;
  
  // Add click handlers
  const courseCards = container.querySelectorAll('.course-card');
  courseCards.forEach(card => {
    card.addEventListener('click', handleCourseClick);
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleCourseClick(e);
    });
  });
}

// Handle course click - show in modal
function handleCourseClick(e) {
  const card = e.currentTarget;
  const courseId = card.dataset.courseId;
  const course = allCourses.find(c => c.id === courseId);
  
  if (course) {
    showCourseModal(course);
    saveViewedCourse(courseId);
  }
}

// Show course in modal
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
        <span>📅 Updated ${course.lastUpdated}</span>
      </div>
      
      <h3>Course Description</h3>
      <p>${course.description}</p>
      
      <h3>What You'll Learn</h3>
      <ul class="learning-objectives">
        ${course.whatYouWillLearn.map(item => `<li>✓ ${item}</li>`).join('')}
      </ul>
      
      <h3>Skills You'll Gain</h3>
      <div class="skills-tags">
        ${course.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
      
      <h3>Requirements</h3>
      <ul>
        ${course.requirements.map(req => `<li>${req}</li>`).join('')}
      </ul>
      
      <h3>Instructor</h3>
      <div class="instructor-info">
        <p><strong>${course.instructor.name}</strong></p>
        <p>${course.instructor.title}</p>
      </div>
      
      <div class="modal-footer">
        <div class="price-info">
          <span class="original-price">$${formatPrice(course.originalPrice)}</span>
          <span class="current-price">$${formatPrice(course.price)}</span>
          <span class="save-badge">Save ${Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%</span>
        </div>
        <button class="btn btn-primary btn-large" onclick="alert('Enrollment feature coming soon!')">Enroll Now</button>
      </div>
    </div>
  `;
  
  modalBody.innerHTML = modalHTML;
  showModal();
}

// Initialize filters
function initFilters() {
  // Category filters
  const categoryCheckboxes = document.querySelectorAll('input[name="category"]');
  categoryCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Level filters
  const levelCheckboxes = document.querySelectorAll('input[name="level"]');
  levelCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Price filters
  const priceRadios = document.querySelectorAll('input[name="price"]');
  priceRadios.forEach(radio => {
    radio.addEventListener('change', applyFilters);
  });
  
  // Duration filters
  const durationCheckboxes = document.querySelectorAll('input[name="duration"]');
  durationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', applyFilters);
  });
  
  // Rating filters
  const ratingRadios = document.querySelectorAll('input[name="rating"]');
  ratingRadios.forEach(radio => {
    radio.addEventListener('change', applyFilters);
  });
  
  // Clear filters
  const clearBtn = document.getElementById('clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearAllFilters);
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-search');
  if (resetBtn) {
    resetBtn.addEventListener('click', clearAllFilters);
  }
}

// Apply all filters using array methods (filter, some, every)
function applyFilters() {
  let filtered = [...allCourses];
  
  // Category filter
  const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
    .map(cb => cb.value)
    .filter(val => val !== 'all');
    
  if (selectedCategories.length > 0) {
    filtered = filtered.filter(course => selectedCategories.includes(course.category));
  }
  
  // Level filter
  const selectedLevels = Array.from(document.querySelectorAll('input[name="level"]:checked'))
    .map(cb => cb.value);
    
  if (selectedLevels.length > 0) {
    filtered = filtered.filter(course => selectedLevels.includes(course.level));
  }
  
  // Price filter
  const selectedPrice = document.querySelector('input[name="price"]:checked')?.value;
  if (selectedPrice && selectedPrice !== 'all') {
    filtered = filtered.filter(course => {
      if (selectedPrice === 'free') return course.price === 0;
      if (selectedPrice === '0-50') return course.price > 0 && course.price <= 50;
      if (selectedPrice === '51-100') return course.price > 50 && course.price <= 100;
      if (selectedPrice === '101+') return course.price > 100;
      return true;
    });
  }
  
  // Duration filter
  const selectedDurations = Array.from(document.querySelectorAll('input[name="duration"]:checked'))
    .map(cb => cb.value);
    
  if (selectedDurations.length > 0) {
    filtered = filtered.filter(course => {
      const duration = parseFloat(course.duration);
      return selectedDurations.some(range => {
        if (range === '0-5') return duration >= 0 && duration < 5;
        if (range === '5-10') return duration >= 5 && duration < 10;
        if (range === '10-20') return duration >= 10 && duration < 20;
        if (range === '20+') return duration >= 20;
        return false;
      });
    });
  }
  
  // Rating filter
  const selectedRating = document.querySelector('input[name="rating"]:checked')?.value;
  if (selectedRating && selectedRating !== 'all') {
    const minRating = parseFloat(selectedRating);
    filtered = filtered.filter(course => course.rating >= minRating);
  }
  
  // Apply search if active
  const searchInput = document.getElementById('course-search');
  if (searchInput && searchInput.value.trim()) {
    filtered = filterBySearch(filtered, searchInput.value, ['title', 'description', 'instructor.name']);
  }
  
  filteredCourses = filtered;
  displayCourses(filteredCourses);
  updateCourseCount(filteredCourses.length);
  
  // Save filter preferences
  saveFilterPreferences();
}

// Clear all filters
function clearAllFilters() {
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    if (radio.value === 'all') radio.checked = true;
  });
  document.getElementById('course-search').value = '';
  
  filteredCourses = [...allCourses];
  displayCourses(filteredCourses);
  updateCourseCount(filteredCourses.length);
}

// Initialize search with debounce
function initSearch() {
  const searchInput = document.getElementById('course-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      applyFilters();
    }, 300));
  }
}

// Initialize view toggle
function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  const coursesDisplay = document.getElementById('courses-grid');
  
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      currentView = view;
      
      // Update active state
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Update display
      if (coursesDisplay) {
        coursesDisplay.className = `courses-display ${view}-view`;
      }
      
      // Save preference
      saveToLocalStorage('preferredView', view);
    });
  });
}

// Initialize sort
function initSort() {
  const sortSelect = document.getElementById('sort-select');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sortBy = e.target.value;
      sortCourses(sortBy);
      saveToLocalStorage('preferredSort', sortBy);
    });
  }
}

// Sort courses using sortBy utility
function sortCourses(sortType) {
  switch (sortType) {
    case 'popular':
      filteredCourses = sortBy(filteredCourses, 'studentsEnrolled', 'desc');
      break;
    case 'newest':
      filteredCourses = sortBy(filteredCourses, 'lastUpdated', 'desc');
      break;
    case 'rating':
      filteredCourses = sortBy(filteredCourses, 'rating', 'desc');
      break;
    case 'price-low':
      filteredCourses = sortBy(filteredCourses, 'price', 'asc');
      break;
    case 'price-high':
      filteredCourses = sortBy(filteredCourses, 'price', 'desc');
      break;
    case 'title':
      filteredCourses = sortBy(filteredCourses, 'title', 'asc');
      break;
  }
  
  displayCourses(filteredCourses);
}

// Update course count
function updateCourseCount(count) {
  const countSpan = document.getElementById('course-count');
  if (countSpan) {
    countSpan.textContent = formatNumber(count);
  }
}

// Save viewed course to local storage
function saveViewedCourse(courseId) {
  const viewedCourses = loadFromLocalStorage('viewedCourses', []);
  
  if (!viewedCourses.includes(courseId)) {
    viewedCourses.push(courseId);
    saveToLocalStorage('viewedCourses', viewedCourses);
  }
}

// Save filter preferences to local storage
function saveFilterPreferences() {
  const preferences = {
    categories: Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value),
    levels: Array.from(document.querySelectorAll('input[name="level"]:checked')).map(cb => cb.value),
    price: document.querySelector('input[name="price"]:checked')?.value,
    durations: Array.from(document.querySelectorAll('input[name="duration"]:checked')).map(cb => cb.value),
    rating: document.querySelector('input[name="rating"]:checked')?.value
  };
  
  saveToLocalStorage('courseFilterPreferences', preferences);
}

// Initialize contact form
function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (form) {
    const timestampInput = document.getElementById('form-timestamp');
    if (timestampInput) {
      timestampInput.value = new Date().toISOString();
    }
    
    form.addEventListener('submit', (e) => {
      // Form will submit normally to form-confirmation.html
      // Timestamp is already set
    });
  }
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
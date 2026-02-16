import { formatNumber, debounce, filterBySearch, sortBy, saveToLocalStorage, animateCounter } from './utils.js';
import { showModal, hideModal, initModal } from './modal.js';

// State
let allInstructors = [];
let filteredInstructors = [];
let allCourses = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initModal();
  await loadData();
  initFilters();
  initSearch();
  initSort();
  animateStats();
  updateFooter();
  initApplicationForm();
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

// Load data with try-catch
async function loadData() {
  const loadingIndicator = document.getElementById('loading-indicator');
  
  try {
    const response = await fetch('data/data.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    allInstructors = data.instructors;
    allCourses = data.courses;
    filteredInstructors = [...allInstructors];
    
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    
    displayInstructors(filteredInstructors);
    updateInstructorCount(filteredInstructors.length);
    
  } catch (error) {
    console.error('Error loading data:', error);
    if (loadingIndicator) loadingIndicator.style.display = 'none';
    displayErrorMessage();
  }
}

// Display instructors (15+ items with 4+ properties each)
function displayInstructors(instructors) {
  const container = document.getElementById('instructors-grid');
  const noResults = document.getElementById('no-results');
  
  if (!container) return;
  
  if (instructors.length === 0) {
    container.style.display = 'none';
    if (noResults) noResults.style.display = 'flex';
    return;
  }
  
  container.style.display = 'grid';
  if (noResults) noResults.style.display = 'none';
  
  // Use map and template literals
  const instructorsHTML = instructors.map(instructor => `
    <article class="instructor-card" data-instructor-id="${instructor.id}" role="button" tabindex="0">
      <img src="${instructor.image}" alt="${instructor.name}" loading="lazy" width="300" height="250">
      <div class="instructor-card-content">
        <span class="instructor-expertise">${instructor.expertise}</span>
        <h3>${instructor.name}</h3>
        <p class="instructor-title">${instructor.title}</p>
        <p>${instructor.bio.substring(0, 120)}...</p>
        <div class="instructor-stats">
          <div class="instructor-stat">
            <span class="instructor-stat-number">${formatNumber(instructor.studentsCount)}</span>
            <span class="instructor-stat-label">Students</span>
          </div>
          <div class="instructor-stat">
            <span class="instructor-stat-number">${instructor.coursesCount}</span>
            <span class="instructor-stat-label">Courses</span>
          </div>
          <div class="instructor-stat">
            <span class="instructor-stat-number">⭐ ${instructor.rating}</span>
            <span class="instructor-stat-label">Rating</span>
          </div>
        </div>
      </div>
    </article>
  `).join('');
  
  container.innerHTML = instructorsHTML;
  
  // Add click handlers
  const instructorCards = container.querySelectorAll('.instructor-card');
  instructorCards.forEach(card => {
    card.addEventListener('click', handleInstructorClick);
    card.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleInstructorClick(e);
    });
  });
}

// Handle instructor click - show modal
function handleInstructorClick(e) {
  const card = e.currentTarget;
  const instructorId = card.dataset.instructorId;
  const instructor = allInstructors.find(i => i.id === instructorId);
  
  if (instructor) {
    showInstructorModal(instructor);
  }
}

// Show instructor in modal
function showInstructorModal(instructor) {
  const modalBody = document.getElementById('modal-body');
  
  // Get instructor's courses
  const instructorCourses = allCourses.filter(c => c.instructor.id === instructor.id);
  
  const modalHTML = `
    <div class="instructor-modal-content">
      <div class="instructor-header">
        <img src="${instructor.image}" alt="${instructor.name}" width="150" height="150">
        <div class="instructor-info">
          <h2 id="modal-title">${instructor.name}</h2>
          <p class="instructor-title">${instructor.title}</p>
          <div class="instructor-meta">
            <span>⭐ ${instructor.rating} rating</span>
            <span>👥 ${formatNumber(instructor.studentsCount)} students</span>
            <span>📚 ${instructor.coursesCount} courses</span>
            <span>💼 ${instructor.yearsExperience} years experience</span>
          </div>
        </div>
      </div>
      
      <h3>About</h3>
      <p>${instructor.bio}</p>
      
      <h3>Education</h3>
      <p>${instructor.education}</p>
      
      <h3>Certifications</h3>
      <ul>
        ${instructor.certifications.map(cert => `<li>✓ ${cert}</li>`).join('')}
      </ul>
      
      ${instructorCourses.length > 0 ? `
        <h3>Courses by ${instructor.name.split(' ')[0]}</h3>
        <div class="instructor-courses">
          ${instructorCourses.map(course => `
            <div class="instructor-course-item">
              <h4>${course.title}</h4>
              <p>⭐ ${course.rating} • ${formatNumber(course.studentsEnrolled)} students • $${course.price}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <h3>Connect</h3>
      <div class="instructor-social">
        ${instructor.socialLinks.linkedin ? `<a href="${instructor.socialLinks.linkedin}" target="_blank" rel="noopener" class="btn btn-outline">LinkedIn</a>` : ''}
        ${instructor.socialLinks.twitter ? `<a href="${instructor.socialLinks.twitter}" target="_blank" rel="noopener" class="btn btn-outline">Twitter</a>` : ''}
        ${instructor.socialLinks.github ? `<a href="${instructor.socialLinks.github}" target="_blank" rel="noopener" class="btn btn-outline">GitHub</a>` : ''}
      </div>
    </div>
  `;
  
  modalBody.innerHTML = modalHTML;
  showModal();
}

// Initialize filters
function initFilters() {
  const filterTabs = document.querySelectorAll('.filter-tab');
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const expertise = e.target.dataset.expertise;
      
      // Update active state
      filterTabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      // Filter instructors
      filterInstructors(expertise);
      
      // Save preference
      saveToLocalStorage('preferredInstructorExpertise', expertise);
    });
  });
  
  // Reset button
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      filterTabs[0].click(); // Click "All Instructors"
      document.getElementById('instructor-search').value = '';
    });
  }
}

// Filter instructors by expertise
function filterInstructors(expertise) {
  if (expertise === 'all') {
    filteredInstructors = [...allInstructors];
  } else {
    filteredInstructors = allInstructors.filter(instructor => instructor.expertise === expertise);
  }
  
  // Apply search if active
  const searchInput = document.getElementById('instructor-search');
  if (searchInput && searchInput.value.trim()) {
    filteredInstructors = filterBySearch(filteredInstructors, searchInput.value, ['name', 'title', 'bio']);
  }
  
  displayInstructors(filteredInstructors);
  updateInstructorCount(filteredInstructors.length);
}

// Initialize search
function initSearch() {
  const searchInput = document.getElementById('instructor-search');
  
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const activeFilter = document.querySelector('.filter-tab.active')?.dataset.expertise || 'all';
      filterInstructors(activeFilter);
    }, 300));
  }
}

// Initialize sort
function initSort() {
  const sortSelect = document.getElementById('sort-select');
  
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      const sortType = e.target.value;
      sortInstructors(sortType);
      saveToLocalStorage('preferredInstructorSort', sortType);
    });
  }
}

// Sort instructors
function sortInstructors(sortType) {
  switch (sortType) {
    case 'name':
      filteredInstructors = sortBy(filteredInstructors, 'name', 'asc');
      break;
    case 'rating':
      filteredInstructors = sortBy(filteredInstructors, 'rating', 'desc');
      break;
    case 'students':
      filteredInstructors = sortBy(filteredInstructors, 'studentsCount', 'desc');
      break;
    case 'courses':
      filteredInstructors = sortBy(filteredInstructors, 'coursesCount', 'desc');
      break;
    case 'experience':
      filteredInstructors = sortBy(filteredInstructors, 'yearsExperience', 'desc');
      break;
  }
  
  displayInstructors(filteredInstructors);
}

// Update instructor count
function updateInstructorCount(count) {
  const countSpan = document.getElementById('instructor-count');
  if (countSpan) {
    countSpan.textContent = formatNumber(count);
  }
}

// Animate statistics
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.count);
    animateCounter(stat, target, 2000);
  });
}

// Initialize application form
function initApplicationForm() {
  const form = document.getElementById('instructor-application-form');
  
  if (form) {
    const timestampInput = document.getElementById('form-timestamp');
    if (timestampInput) {
      timestampInput.value = new Date().toISOString();
    }
    
    form.addEventListener('submit', (e) => {
      // Form will submit normally to form-confirmation.html
      // Save application to local storage
      const formData = new FormData(form);
      const applicationData = Object.fromEntries(formData.entries());
      
      const applications = JSON.parse(localStorage.getItem('instructorApplications') || '[]');
      applications.push(applicationData);
      saveToLocalStorage('instructorApplications', applications);
    });
  }
}

// Display error message
function displayErrorMessage() {
  const container = document.getElementById('instructors-grid');
  if (container) {
    container.innerHTML = `
      <div class="error-message">
        <p>Unable to load instructors. Please try again later.</p>
        <button class="btn btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `;
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
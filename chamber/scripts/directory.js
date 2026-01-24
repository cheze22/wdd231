
const membersDirectory = document.getElementById('members-directory');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error:', error);
        membersDirectory.innerHTML = '<p class="error-message">Error al cargar los miembros. Por favor, intenta más tarde.</p>';
    }
}

function displayMembers(members) {
    membersDirectory.innerHTML = ''; 
    
    members.forEach(member => {
        const memberCard = createMemberCard(member);
        membersDirectory.appendChild(memberCard);
    });
}

function createMemberCard(member) {
    const card = document.createElement('div');
    card.classList.add('member-card');
    
    const membershipClass = getMembershipClass(member.membershipLevel);
    card.classList.add(membershipClass);
    
    card.innerHTML = `
        <div class="member-image">
            <img src="images/${member.image}" alt="${member.name}" loading="lazy">
            <span class="membership-badge">${getMembershipLabel(member.membershipLevel)}</span>
        </div>
        <div class="member-content">
            <h3>${member.name}</h3>
            <p class="member-category">${member.category}</p>
            <p class="member-description">${member.description}</p>
            <div class="member-details">
                <p><strong>📍</strong> ${member.address}</p>
                <p><strong>📞</strong> ${member.phone}</p>
                <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener">Visitar sitio web</a></p>
                <p class="member-founded">Fundada en ${member.founded}</p>
            </div>
        </div>
    `;
    
    return card;
}

function getMembershipClass(level) {
    switch(level) {
        case 1:
            return 'membership-member';
        case 2:
            return 'membership-silver';
        case 3:
            return 'membership-gold';
        default:
            return 'membership-member';
    }
}

function getMembershipLabel(level) {
    switch(level) {
        case 1:
            return 'Member';
        case 2:
            return 'Silver';
        case 3:
            return 'Gold';
        default:
            return 'Member';
    }
}

function switchToGridView() {
    membersDirectory.classList.remove('list-view');
    membersDirectory.classList.add('grid-view');
    
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    
    localStorage.setItem('viewPreference', 'grid');
}

function switchToListView() {
    membersDirectory.classList.remove('grid-view');
    membersDirectory.classList.add('list-view');
    
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    
    localStorage.setItem('viewPreference', 'list');
}

function toggleMenu() {
    mainNav.classList.toggle('open');
    menuToggle.classList.toggle('open');
    
    const isOpen = mainNav.classList.contains('open');
    menuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
}

function displayCurrentYear() {
    const currentYearSpan = document.getElementById('current-year');
    const currentYear = new Date().getFullYear();
    currentYearSpan.textContent = currentYear;
}

function displayLastModified() {
    const lastModifiedSpan = document.getElementById('last-modified');
    const lastModified = document.lastModified;
    lastModifiedSpan.textContent = lastModified;
}

function loadViewPreference() {
    const savedView = localStorage.getItem('viewPreference');
    
    if (savedView === 'list') {
        switchToListView();
    } else {
        switchToGridView();
    }
}

gridViewBtn.addEventListener('click', switchToGridView);
listViewBtn.addEventListener('click', switchToListView);
menuToggle.addEventListener('click', toggleMenu);

const navLinks = mainNav.querySelectorAll('a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mainNav.classList.contains('open')) {
            toggleMenu();
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
 
    getMembers();
    
    
    loadViewPreference();
    
   
    displayCurrentYear();
    
    
    displayLastModified();
});


const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('¡Gracias por suscribirte a nuestro newsletter!');
        newsletterForm.reset();
    });
}


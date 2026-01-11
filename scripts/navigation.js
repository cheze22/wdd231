
function setupHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    
    if (!hamburger || !nav) {
        console.error('Hamburger button or nav not found');
        return;
    }
    
    hamburger.addEventListener('click', function() {
      
        hamburger.classList.toggle('active');
        
     
        nav.classList.toggle('active');
        
        const isOpen = nav.classList.contains('active');
        hamburger.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Toggle navigation menu');
    });
}

function setupNavLinks() {
    const navLinks = document.querySelectorAll('#mainNav a');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 768) {
                if (hamburger) hamburger.classList.remove('active');
                if (nav) nav.classList.remove('active');
            }
        });
    });
}

function highlightActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#mainNav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function handleResize() {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('mainNav');
    
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            if (hamburger) hamburger.classList.remove('active');
            if (nav) nav.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation.js loaded');
    setupHamburgerMenu();
    setupNavLinks();
    highlightActiveLink();
    handleResize();
});
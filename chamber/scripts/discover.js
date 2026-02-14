
import attractions from '../data/attractions.mjs';

const attractionsGallery = document.getElementById('attractions-gallery');
const visitMessage = document.getElementById('visit-message');
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    mainNav.classList.toggle('open');
});

function displayVisitMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    if (!lastVisit) {
        visitMessage.innerHTML = `
            <div class="message-content welcome">
                <p>🎉 Welcome! Let us know if you have any questions.</p>
                <button class="close-message" aria-label="Close message">×</button>
            </div>
        `;
    } else {
        const lastVisitDate = parseInt(lastVisit);
        const timeDifference = now - lastVisitDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference < 1) {
            visitMessage.innerHTML = `
                <div class="message-content recent">
                    <p>🚀 Back so soon! Awesome!</p>
                    <button class="close-message" aria-label="Close message">×</button>
                </div>
            `;
        } else {
            const dayText = daysDifference === 1 ? 'day' : 'days';
            visitMessage.innerHTML = `
                <div class="message-content returning">
                    <p>👋 You last visited ${daysDifference} ${dayText} ago.</p>
                    <button class="close-message" aria-label="Close message">×</button>
                </div>
            `;
        }
    }
    
    localStorage.setItem('lastVisit', now.toString());
    
    const closeButton = document.querySelector('.close-message');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            visitMessage.style.display = 'none';
        });
    }
}

function createAttractionCard(attraction) {
    const card = document.createElement('article');
    card.classList.add('attraction-card');
    
    card.innerHTML = `
        <h2>${attraction.name}</h2>
        <figure>
            <img 
                src="${attraction.image}" 
                alt="${attraction.name}"
                loading="lazy"
                width="275"
                height="183"
            >
            <figcaption>${attraction.category}</figcaption>
        </figure>
        <address>${attraction.address}</address>
        <p>${attraction.description}</p>
        <button class="learn-more-btn">Learn More</button>
    `;
    
    return card;
}

function displayAttractions() {
    attractionsGallery.innerHTML = '';
    
    attractions.forEach(attraction => {
        const card = createAttractionCard(attraction);
        attractionsGallery.appendChild(card);
    });
    
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    learnMoreButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            alert(`More information about ${attractions[index].name} coming soon!`);
        });
    });
}

function updateFooterInfo() {
    const currentYearElement = document.getElementById('currentyear');
    const lastModifiedElement = document.getElementById('lastModified');
    
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    if (lastModifiedElement) {
        lastModifiedElement.textContent = document.lastModified;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayVisitMessage();
    displayAttractions();
    updateFooterInfo();
});

function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function updateLastModified() {
    const modifiedElement = document.getElementById('lastModified');
    if (modifiedElement) {
        modifiedElement.textContent = `Last Modified: ${document.lastModified}`;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Dates.js loaded');
    updateCurrentYear();
    updateLastModified();
});

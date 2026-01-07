import './style.css';
import { chalisaData } from './data/chalisa-data.js';

let currentIndex = 0;
const container = document.getElementById('card-container');
const indicator = document.getElementById('verse-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let touchStartX = 0;
let touchCurrentX = 0;
let isDragging = false;

// Hinglish state
let isHinglish = false;

function init() {
    renderCards();
    updateIndicator();
    setupEventListeners();
    showCard(currentIndex);

    // Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 1000);
        }, 2000);
    }
}

function renderCards() {
    container.innerHTML = '';
    chalisaData.forEach((verse, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${index}`;

        // Meaning removed as per request
        card.innerHTML = `
      <div class="verse-type">${verse.type} ${verse.verse_number}</div>
      <div class="verse-hindi" style="display: ${isHinglish ? 'none' : 'block'}">${verse.hindi}</div>
      <div class="verse-transliteration ${isHinglish ? 'visible' : ''}" style="display: ${isHinglish ? 'block' : 'none'}">${verse.transliteration}</div>
    `;

        container.appendChild(card);
    });
}

function toggleLanguage() {
    isHinglish = !isHinglish;
    document.getElementById('lang-toggle').classList.toggle('active');
    document.getElementById('card-container').classList.toggle('mode-hinglish');

    const hindiVerses = document.querySelectorAll('.verse-hindi');
    const transliterations = document.querySelectorAll('.verse-transliteration');

    if (isHinglish) {
        // Show Transliteration, Hide Hindi
        hindiVerses.forEach(el => el.style.display = 'none');
        transliterations.forEach(el => {
            el.style.display = 'block';
            el.classList.add('visible');
        });
    } else {
        // Show Hindi, Hide Transliteration
        hindiVerses.forEach(el => el.style.display = 'block');
        transliterations.forEach(el => {
            el.style.display = 'none';
            el.classList.remove('visible');
        });
    }
}

function showCard(index, animate = true) {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, i) => {
        card.style.transition = animate ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.4s ease' : 'none';
        card.style.transform = ''; // Clear inline styles from dragging

        card.classList.remove('active', 'prev', 'next');
        if (i === index) {
            card.classList.add('active');
        } else if (i < index) {
            card.classList.add('prev');
        } else {
            card.classList.add('next');
        }
    });
    updateIndicator();
}

function updateIndicator() {
    indicator.innerText = `${currentIndex + 1} / ${chalisaData.length}`;
}

function nextVerse() {
    if (currentIndex < chalisaData.length - 1) {
        currentIndex++;
        showCard(currentIndex);
    } else {
        // Bounce effect if at end
        showCard(currentIndex);
    }
}

function prevVerse() {
    if (currentIndex > 0) {
        currentIndex--;
        showCard(currentIndex);
    } else {
        // Bounce effect if at start
        showCard(currentIndex);
    }
}

function setupEventListeners() {
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

    nextBtn.addEventListener('click', () => {
        nextBtn.style.transform = 'scale(0.9)';
        setTimeout(() => nextBtn.style.transform = '', 100);
        nextVerse();
    });

    prevBtn.addEventListener('click', () => {
        prevBtn.style.transform = 'scale(0.9)';
        setTimeout(() => prevBtn.style.transform = '', 100);
        prevVerse();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') nextVerse();
        if (e.key === 'ArrowLeft') prevVerse();
    });

    // Advanced Touch/Swipe with Feedback
    container.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        const activeCard = container.querySelector('.card.active');
        if (activeCard) activeCard.style.transition = 'none';
    }, { passive: true });

    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        touchCurrentX = e.touches[0].clientX;
        const diff = touchCurrentX - touchStartX;

        const activeCard = container.querySelector('.card.active');
        if (activeCard) {
            const rotation = diff / 20;
            activeCard.style.transform = `translate(calc(-50% + ${diff}px), -50%) rotate(${rotation}deg)`;
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = touchCurrentX - touchStartX;
        const threshold = window.innerWidth * 0.25;

        if (diff < -threshold) {
            nextVerse();
        } else if (diff > threshold) {
            prevVerse();
        } else {
            showCard(currentIndex); // Snap back
        }

        touchStartX = 0;
        touchCurrentX = 0;
    }, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

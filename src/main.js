import './style.css';
import { chalisaData } from './data/chalisa-data.js';
import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { ScreenReader } from '@capacitor/screen-reader';

let currentIndex = 0;
let hasShownRatingPrompt = false;
const container = document.getElementById('card-container');
const indicator = document.getElementById('verse-indicator');
const announcer = document.getElementById('verse-announcer');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const ttsToggleBtn = document.getElementById('tts-toggle');
const ttsStatus = document.getElementById('tts-status');
const sfxToggleBtn = document.getElementById('sfx-toggle');
const langToggleBtn = document.getElementById('lang-toggle');

// Sound effects (bells) can be muted independently of speech/system volume,
// and any currently-playing bell can be stopped immediately (WCAG 1.4.2 Audio Control).
let sfxMuted = false;

let touchStartX = 0;
let touchCurrentX = 0;
let isDragging = false;

// Hinglish state
let isHinglish = false;
// Audio assets
const bigBellAudio = new Audio('/assets/BigBell.mp3');
const smallBellAudio = new Audio('/assets/small-pooja-bell-fast.mp3');
bigBellAudio.preload = 'auto';
smallBellAudio.preload = 'auto';
bigBellAudio.volume = 0.9;
smallBellAudio.volume = 0.9;
let hasPlayedCompletionBell = false;

// TTS state
let ttsVoice = null;
let ttsUtterances = [];
let ttsEnabled = false;
let ttsPaused = false;
let voicesResolved = false;

function playBell(audio) {
    if (sfxMuted) return;
    try { audio.currentTime = 0; audio.play().catch(() => { }); } catch (e) { }
}

function stopAllBells() {
    [bigBellAudio, smallBellAudio].forEach(a => {
        try { a.pause(); a.currentTime = 0; } catch (e) { }
    });
}

async function isScreenReaderActive() {
    try {
        const { value } = await ScreenReader.isEnabled();
        return value;
    } catch (e) {
        return false;
    }
}

const ORIENTATION_ANNOUNCED_KEY = 'hc_sr_orientation_announced';

async function announceOrientationOnce() {
    if (localStorage.getItem(ORIENTATION_ANNOUNCED_KEY)) return;
    localStorage.setItem(ORIENTATION_ANNOUNCED_KEY, '1');
    const message = `Hanuman Chalisa Cards. ${chalisaData.length} verses. Use the Next and Previous buttons, or swipe, to move between verses. Auto Recite reads each verse aloud automatically.`;
    try {
        await ScreenReader.speak({ value: message, language: 'en-US' });
    } catch (e) { }
}

async function init() {
    renderCards();
    updateIndicator();
    setupEventListeners();
    initTTS();
    updateSfxUi();
    showCard(currentIndex);

    const screenReaderActive = await isScreenReaderActive();

    // Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    if (splash) {
        // Ring the big bell once on launch while splash is visible
        setTimeout(() => playBell(bigBellAudio), 200);

        // The splash is purely decorative (already aria-hidden) - screen-reader users
        // get no value from waiting through its animation, so skip the delay for them.
        const revealDelay = screenReaderActive ? 0 : 2000;
        const fadeDuration = screenReaderActive ? 0 : 1000;
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, fadeDuration);
        }, revealDelay);
    }

    if (screenReaderActive) {
        setTimeout(() => announceOrientationOnce(), 800);
    }
}

function renderCards() {
    container.innerHTML = '';
    chalisaData.forEach((verse, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.id = `card-${index}`;
        card.setAttribute('role', 'group');
        card.setAttribute('aria-roledescription', 'slide');
        card.setAttribute('aria-label', `${verse.type} ${verse.verse_number}, verse ${index + 1} of ${chalisaData.length}`);
        card.setAttribute('aria-hidden', 'true');

        // Meaning removed as per request
        card.innerHTML = `
      <h2 class="verse-type">${verse.type} ${verse.verse_number}</h2>
      <div class="verse-hindi" lang="hi" style="display: ${isHinglish ? 'none' : 'block'}">${verse.hindi}</div>
      <div class="verse-transliteration ${isHinglish ? 'visible' : ''}" style="display: ${isHinglish ? 'block' : 'none'}">${verse.transliteration}</div>
    `;

        container.appendChild(card);
    });

    // Completion card (after the Closing Doha)
    const completion = document.createElement('div');
    completion.className = 'card completion-card';
    completion.id = 'completion-card';
    completion.setAttribute('role', 'group');
    completion.setAttribute('aria-roledescription', 'slide');
    completion.setAttribute('aria-label', 'Chalisa complete');
    completion.setAttribute('aria-hidden', 'true');
    completion.innerHTML = `
      <div class="completion-inner">
        <div class="bell-emoji" id="completion-bell" aria-hidden="true">🔔</div>
        <h2 class="completion-title">Chalisa Complete</h2>
        <p class="completion-sub">May Hanumanji bless you with strength and devotion.</p>
        <button class="ring-btn" type="button" id="ring-big-bell-btn">Ring the Big Bell</button>
      </div>
    `;
    container.appendChild(completion);

    // Hook up ring button
    const ringBtn = completion.querySelector('#ring-big-bell-btn');
    const bellEl = completion.querySelector('#completion-bell');
    if (ringBtn) {
        ringBtn.addEventListener('click', () => {
            playBell(bigBellAudio);
            if (bellEl) {
                bellEl.classList.add('ring');
                setTimeout(() => bellEl.classList.remove('ring'), 700);
            }
        });
    }
}

function toggleLanguage() {
    isHinglish = !isHinglish;
    langToggleBtn.classList.toggle('active');
    langToggleBtn.setAttribute('aria-pressed', String(isHinglish));
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
            card.removeAttribute('aria-hidden');
            card.removeAttribute('inert');
        } else {
            card.setAttribute('aria-hidden', 'true');
            card.setAttribute('inert', '');
            if (i < index) {
                card.classList.add('prev');
            } else {
                card.classList.add('next');
            }
        }
    });
    // When landing on completion card, play small bell once
    if (index === chalisaData.length && !hasPlayedCompletionBell) {
        hasPlayedCompletionBell = true;
        playBell(smallBellAudio);
    }
    updateIndicator();
    announceCurrentVerse(index);
}

function announceCurrentVerse(index) {
    if (!announcer) return;
    if (index >= chalisaData.length) {
        announcer.textContent = 'Chalisa complete';
        return;
    }
    const verse = chalisaData[index];
    announcer.textContent = `${verse.type} ${verse.verse_number}, verse ${index + 1} of ${chalisaData.length}`;
}

function updateIndicator() {
    const displayIndex = Math.min(currentIndex + 1, chalisaData.length);
    indicator.innerText = `${displayIndex} / ${chalisaData.length}`;
}

// TextToSpeech Hybrid Implementation
// - Native: Uses @capacitor-community/text-to-speech (Google TTS)
// - Web: Uses window.speechSynthesis (Web Speech API)

async function initTTS() {
    if (Capacitor.isNativePlatform()) {
        try {
            await TextToSpeech.getSupportedLanguages();
            updateTtsUi('Off');
        } catch (e) {
            console.error('Native TTS Init Error:', e);
            updateTtsUi('Off');
        }
    } else {
        if (!('speechSynthesis' in window)) {
            updateTtsUi('Unsupported');
            return;
        }

        const assignWebVoice = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length) {
                ttsVoice = pickWebVoice(voices);
                voicesResolved = true;
                updateTtsUi('Off');
            }
        };

        window.speechSynthesis.onvoiceschanged = assignWebVoice;
        assignWebVoice();
    }
}

function pickWebVoice(voices) {
    const hindi = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('hi'));
    if (!hindi.length) return voices[0];
    const male = hindi.find(v => !v.name.toLowerCase().includes('female'));
    return male || hindi[0];
}

async function startTts() {
    ttsEnabled = true;
    ttsPaused = false;
    updateTtsUi('Playing');

    // If at completion card, restart
    if (currentIndex >= chalisaData.length) {
        currentIndex = 0;
    }

    speakFrom(currentIndex);
}

async function stopTts(reason = '') {
    ttsEnabled = false;
    ttsPaused = false;

    if (Capacitor.isNativePlatform()) {
        try { await TextToSpeech.stop(); } catch (e) { }
    } else {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    }

    updateTtsUi(reason === 'Unsupported' ? 'Not supported' : 'Off');
}

async function speakFrom(index) {
    if (!ttsEnabled) return;

    if (index < 0 || index >= chalisaData.length) {
        handleTtsCompletion();
        return;
    }

    currentIndex = index;
    showCard(currentIndex, false);
    updateTtsUi('Playing');

    const verse = chalisaData[index];

    if (Capacitor.isNativePlatform()) {
        try {
            await TextToSpeech.speak({
                text: verse.hindi,
                lang: 'hi-IN',
                rate: 0.8,
                pitch: 1.0,
                volume: 1.0,
                category: 'ambient',
            });

            if (ttsEnabled && currentIndex === index) {
                setTimeout(() => {
                    if (ttsEnabled) {
                        currentIndex++;
                        speakFrom(currentIndex);
                    }
                }, 400);
            }
        } catch (e) {
            console.error('TTS Error:', e);
            stopTts('Error');
        }
    } else {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(verse.hindi);
        utt.lang = 'hi-IN';
        utt.rate = 0.8;
        if (ttsVoice) utt.voice = ttsVoice;

        utt.onend = () => {
            if (ttsEnabled && currentIndex === index) {
                setTimeout(() => {
                    if (ttsEnabled) {
                        currentIndex++;
                        speakFrom(currentIndex);
                    }
                }, 400);
            }
        };

        utt.onerror = () => stopTts('Error');
        window.speechSynthesis.speak(utt);
    }
}

function handleTtsCompletion() {
    currentIndex = chalisaData.length;
    showCard(currentIndex);
    stopTts();
    updateTtsUi('Completed');
    setTimeout(() => {
        if (!ttsEnabled) updateTtsUi('Off');
    }, 2000);
}

function updateTtsUi(forcedText = '') {
    const statusText = forcedText || (ttsEnabled ? 'Playing' : 'Off');
    if (ttsStatus) ttsStatus.innerText = statusText;

    if (ttsToggleBtn) {
        ttsToggleBtn.innerHTML = ttsEnabled
            ? '<span aria-hidden="true">⏹️</span> Stop'
            : '<span aria-hidden="true">🔈</span> Auto Recite';
        ttsToggleBtn.setAttribute('aria-label', ttsEnabled ? 'Stop Auto Recite' : 'Start Auto Recite');
        ttsToggleBtn.setAttribute('aria-pressed', String(ttsEnabled));
        ttsToggleBtn.classList.toggle('active', ttsEnabled);
        ttsToggleBtn.classList.toggle('disabled', forcedText === 'Not supported');
    }
}

function updateSfxUi() {
    if (!sfxToggleBtn) return;
    sfxToggleBtn.innerHTML = sfxMuted
        ? '<span aria-hidden="true">🔕</span>'
        : '<span aria-hidden="true">🔔</span>';
    sfxToggleBtn.setAttribute('aria-label', sfxMuted ? 'Unmute bell sound effects' : 'Mute bell sound effects');
    sfxToggleBtn.setAttribute('aria-pressed', String(sfxMuted));
    sfxToggleBtn.classList.toggle('active', sfxMuted);
}

function nextVerse() {
    // Stop TTS if user manually navigates
    if (ttsEnabled) {
        stopTts();
    }

    // Allow navigating to the completion card at index == chalisaData.length
    if (currentIndex < chalisaData.length) {
        currentIndex++;
        showCard(currentIndex);

        // Show rating prompt after last doha
        if (currentIndex === chalisaData.length - 1 && !hasShownRatingPrompt) {
            setTimeout(() => showRatingPrompt(), 1000);
        }
    } else {
        // Bounce effect if at end
        showCard(currentIndex);
    }
}

function prevVerse() {
    // Stop TTS if user manually navigates
    if (ttsEnabled) {
        stopTts();
    }

    if (currentIndex > 0) {
        currentIndex--;
        showCard(currentIndex);
    } else {
        // Bounce effect if at start
        showCard(currentIndex);
    }
}

function setupEventListeners() {
    langToggleBtn.addEventListener('click', toggleLanguage);

    if (ttsToggleBtn) {
        ttsToggleBtn.addEventListener('click', () => {
            if (!Capacitor.isNativePlatform() && !('speechSynthesis' in window)) {
                stopTts('Unsupported');
                return;
            }
            if (ttsEnabled) {
                stopTts();
            } else {
                startTts();
            }
        });
    }

    if (sfxToggleBtn) {
        sfxToggleBtn.addEventListener('click', () => {
            sfxMuted = !sfxMuted;
            if (sfxMuted) stopAllBells();
            updateSfxUi();
        });
    }

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
        // Don't let card navigation fire underneath an open dialog
        if (document.querySelector('.rating-modal')) return;
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
            // Stop TTS before manual navigation
            if (ttsEnabled) stopTts();
            nextVerse();
        } else if (diff > threshold) {
            // Stop TTS before manual navigation
            if (ttsEnabled) stopTts();
            prevVerse();
        } else {
            showCard(currentIndex); // Snap back
        }

        touchStartX = 0;
        touchCurrentX = 0;
    }, { passive: true });
}

async function showRatingPrompt() {
    if (hasShownRatingPrompt) return;
    hasShownRatingPrompt = true;

    const previouslyFocused = document.activeElement;
    const appRoot = document.getElementById('app');

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'rating-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'rating-modal-title');
    modal.innerHTML = `
        <div class="rating-modal-content">
            <div class="rating-icon" aria-hidden="true">⭐</div>
            <h2 id="rating-modal-title">Enjoying Hanuman Chalisa?</h2>
            <p>Please take a moment to rate us 5 stars on Google Play Store</p>
            <div class="rating-buttons">
                <button class="rating-btn rating-btn-primary" type="button" id="rate-now">Rate Now ⭐⭐⭐⭐⭐</button>
                <button class="rating-btn rating-btn-secondary" type="button" id="rate-later">Maybe Later</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    if (appRoot) appRoot.setAttribute('inert', '');

    const rateNowBtn = modal.querySelector('#rate-now');
    const rateLaterBtn = modal.querySelector('#rate-later');
    const focusableEls = [rateNowBtn, rateLaterBtn];

    function trapFocus(e) {
        if (e.key === 'Escape') {
            e.preventDefault();
            dismiss();
            return;
        }
        if (e.key !== 'Tab') return;
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }

    function dismiss() {
        closeRatingModal(modal, appRoot, previouslyFocused);
        modal.removeEventListener('keydown', trapFocus);
        hasShownRatingPrompt = false; // Allow showing again later
    }

    modal.addEventListener('keydown', trapFocus);

    // Fade in animation
    setTimeout(() => {
        modal.classList.add('show');
        rateNowBtn.focus();
    }, 10);

    // Handle rating button click
    rateNowBtn.addEventListener('click', async () => {
        closeRatingModal(modal, appRoot, previouslyFocused);
        modal.removeEventListener('keydown', trapFocus);
        await openPlayStore();
    });

    // Handle later button click
    rateLaterBtn.addEventListener('click', dismiss);
}

function closeRatingModal(modal, appRoot, previouslyFocused) {
    modal.classList.remove('show');
    if (appRoot) appRoot.removeAttribute('inert');
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus();
    }
    setTimeout(() => modal.remove(), 300);
}

async function openPlayStore() {
    const packageName = 'com.hanuman.chalisa.cards';

    try {
        // Try to get app info to check if we're on native platform
        const info = await App.getInfo();

        // Try to open Play Store app first (native)
        window.location.href = `market://details?id=${packageName}`;

        // Fallback to browser after a delay
        setTimeout(() => {
            window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_blank');
        }, 500);
    } catch (error) {
        // Web fallback
        window.open(`https://play.google.com/store/apps/details?id=${packageName}`, '_blank');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

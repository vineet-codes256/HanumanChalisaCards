import './style.css';
import { chalisaData } from './data/chalisa-data.js';
import { App } from '@capacitor/app';

let currentIndex = 0;
let hasShownRatingPrompt = false;
const container = document.getElementById('card-container');
const indicator = document.getElementById('verse-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const ttsToggleBtn = document.getElementById('tts-toggle');
const ttsStatus = document.getElementById('tts-status');

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

function init() {
    renderCards();
    updateIndicator();
    setupEventListeners();
    initTTS();
    showCard(currentIndex);

    // Splash Screen Logic
    const splash = document.getElementById('splash-screen');
    if (splash) {
        // Ring the big bell once on launch while splash is visible
        setTimeout(() => {
            try { bigBellAudio.currentTime = 0; bigBellAudio.play().catch(() => {});} catch (e) {}
        }, 200);
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

    // Completion card (after the Closing Doha)
    const completion = document.createElement('div');
    completion.className = 'card completion-card';
    completion.id = 'completion-card';
    completion.innerHTML = `
      <div class="completion-inner">
        <div class="bell-emoji" id="completion-bell">🔔</div>
        <h2 class="completion-title">Chalisa Complete</h2>
        <p class="completion-sub">May Hanumanji bless you with strength and devotion.</p>
        <button class="ring-btn" id="ring-big-bell-btn">Ring the Big Bell</button>
      </div>
    `;
    container.appendChild(completion);

    // Hook up ring button
    const ringBtn = completion.querySelector('#ring-big-bell-btn');
    const bellEl = completion.querySelector('#completion-bell');
    if (ringBtn) {
        ringBtn.addEventListener('click', () => {
            try { bigBellAudio.currentTime = 0; bigBellAudio.play().catch(() => {});} catch (e) {}
            if (bellEl) {
                bellEl.classList.add('ring');
                setTimeout(() => bellEl.classList.remove('ring'), 700);
            }
        });
    }
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
    // When landing on completion card, play small bell once
    if (index === chalisaData.length && !hasPlayedCompletionBell) {
        hasPlayedCompletionBell = true;
        try { smallBellAudio.currentTime = 0; smallBellAudio.play().catch(() => {});} catch (e) {}
    }
    updateIndicator();
}

function updateIndicator() {
    const displayIndex = Math.min(currentIndex + 1, chalisaData.length);
    indicator.innerText = `${displayIndex} / ${chalisaData.length}`;
}

function pickPreferredVoice(voices) {
    console.log('Available voices:', voices.length);
    if (!voices.length) return null;
    
    // Filter Hindi voices
    const hindiVoices = voices.filter(v => v.lang && v.lang.toLowerCase().startsWith('hi'));
    console.log('Hindi voices found:', hindiVoices.length);
    
    if (hindiVoices.length === 0) {
        // No Hindi voices, use first available
        console.log('No Hindi voices, using:', voices[0].name);
        return voices[0];
    }
    
    // Find male voice by excluding female keywords
    const maleVoice = hindiVoices.find(v => {
        const name = (v.name || '').toLowerCase();
        return !name.includes('female') && !name.includes('woman');
    });
    
    if (maleVoice) {
        console.log('Selected male voice:', maleVoice.name);
        return maleVoice;
    }
    
    // Fallback to first Hindi voice
    console.log('Using first Hindi voice:', hindiVoices[0].name);
    return hindiVoices[0];
}

function buildTtsUtterances() {
    console.log('Building TTS utterances with voice:', ttsVoice?.name || 'system default');
    ttsUtterances = chalisaData.map((verse, idx) => {
        const utt = new SpeechSynthesisUtterance(verse.hindi);
        utt.lang = 'hi-IN';
        utt.rate = 0.6;
        utt.pitch = 1.0;
        utt.volume = 1.0;
        
        // Set voice if available (system will use default if null)
        if (ttsVoice) {
            utt.voice = ttsVoice;
        }

        utt.onstart = () => {
            console.log('Speaking verse:', idx);
            if (!ttsEnabled) return;
            updateIndicator();
            updateTtsUi();
        };

        utt.onend = () => {
            console.log('Finished verse:', idx, 'currentIndex:', currentIndex, 'ttsEnabled:', ttsEnabled);
            // Only advance if this is still the current verse and TTS is still enabled
            if (!ttsEnabled || currentIndex !== idx) {
                console.log('Skipping advance - state changed');
                return;
            }
            
            // Add pause between verses
            setTimeout(() => {
                if (!ttsEnabled || currentIndex !== idx) {
                    console.log('Skipping advance after delay - state changed');
                    return;
                }
                
                const nextIndex = idx + 1;
                if (nextIndex < chalisaData.length) {
                    console.log('Advancing to:', nextIndex);
                    currentIndex = nextIndex;
                    speakFrom(currentIndex);
                } else {
                    console.log('Completed all verses');
                    handleTtsCompletion();
                }
            }, 500);
        };

        utt.onerror = (e) => {
            console.error('TTS error for verse', idx, ':', e);
            stopTts('Error');
        };

        return utt;
    });
    console.log('Built', ttsUtterances.length, 'utterances');
}

function speakFrom(index) {
    console.log('=== speakFrom called ===');
    console.log('Index:', index, 'ttsEnabled:', ttsEnabled, 'currentIndex:', currentIndex);
    
    if (!ttsEnabled) {
        console.log('TTS not enabled, exiting');
        return;
    }
    
    if (!ttsUtterances.length) {
        console.log('No utterances, building them');
        buildTtsUtterances();
    }
    
    if (index < 0 || index >= ttsUtterances.length) {
        console.log('Invalid index, completing');
        handleTtsCompletion();
        return;
    }

    // Update current index and show card
    currentIndex = index;
    showCard(currentIndex, false);
    
    // Get the utterance
    const utt = ttsUtterances[index];
    console.log('Utterance text:', utt.text.substring(0, 50) + '...');
    console.log('Utterance voice:', utt.voice?.name || 'system default');

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Wait a bit then speak
    setTimeout(() => {
        if (!ttsEnabled || currentIndex !== index) {
            console.log('State changed during delay, not speaking');
            return;
        }
        console.log('Calling speak() now');
        window.speechSynthesis.speak(utt);
        updateTtsUi();
    }, 100);
}

function startTts() {
    if (!('speechSynthesis' in window)) return;
    if (!voicesResolved) {
        updateTtsUi('Loading voice...');
        return;
    }

    if (!ttsUtterances.length) buildTtsUtterances();
    ttsEnabled = true;
    ttsPaused = false;

    // If at completion card, restart from beginning
    if (currentIndex >= chalisaData.length) {
        currentIndex = 0;
    }
    
    speakFrom(currentIndex);
}

function stopTts(reason = '') {
    ttsEnabled = false;
    ttsPaused = false;
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    
    updateTtsUi(reason === 'Unsupported' ? 'Not supported' : 'Off');
}

function handleTtsCompletion() {
    currentIndex = chalisaData.length;
    showCard(currentIndex);
    ttsEnabled = false;
    ttsPaused = false;
    updateTtsUi('Completed');
    
    // Show status as 'Off' after brief delay
    setTimeout(() => {
        if (!ttsEnabled) updateTtsUi('Off');
    }, 2000);
}

function initTTS() {
    if (!('speechSynthesis' in window)) {
        console.log('speechSynthesis not supported');
        stopTts('Unsupported');
        return;
    }

    const assignVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded, count:', voices.length);
        if (!voices.length) return false;
        voicesResolved = true;
        ttsVoice = pickPreferredVoice(voices);
        if (ttsUtterances.length) {
            // Rebuild utterances with new voice
            buildTtsUtterances();
        }
        updateTtsUi();
        return true;
    };

    // Try immediate load
    if (assignVoice()) {
        console.log('Voices loaded immediately');
    } else {
        console.log('Waiting for voices...');
        // Set up listener for when voices are loaded
        window.speechSynthesis.onvoiceschanged = () => {
            console.log('Voices changed event fired');
            if (!voicesResolved) {
                assignVoice();
            }
        };
        
        // Fallback: try again after a delay
        setTimeout(() => {
            if (!voicesResolved) {
                console.log('Retrying voice load after timeout');
                assignVoice();
            }
        }, 1000);
    }
}

function updateTtsUi(forcedText = '') {
    const statusText = forcedText || (ttsEnabled ? 'Playing' : 'Off');
    if (ttsStatus) ttsStatus.innerText = statusText;

    if (ttsToggleBtn) {
        ttsToggleBtn.textContent = ttsEnabled ? '⏹️ Stop' : '🔈 Auto Recite';
        ttsToggleBtn.classList.toggle('active', ttsEnabled);
        ttsToggleBtn.classList.toggle('disabled', forcedText === 'Not supported');
    }
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
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);

    if (ttsToggleBtn) {
        ttsToggleBtn.addEventListener('click', () => {
            if (!('speechSynthesis' in window)) {
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

    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'rating-modal';
    modal.innerHTML = `
        <div class="rating-modal-content">
            <div class="rating-icon">⭐</div>
            <h2>Enjoying Hanuman Chalisa?</h2>
            <p>Please take a moment to rate us 5 stars on Google Play Store</p>
            <div class="rating-buttons">
                <button class="rating-btn rating-btn-primary" id="rate-now">Rate Now ⭐⭐⭐⭐⭐</button>
                <button class="rating-btn rating-btn-secondary" id="rate-later">Maybe Later</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Fade in animation
    setTimeout(() => modal.classList.add('show'), 10);

    // Handle rating button click
    document.getElementById('rate-now').addEventListener('click', async () => {
        closeRatingModal(modal);
        await openPlayStore();
    });

    // Handle later button click
    document.getElementById('rate-later').addEventListener('click', () => {
        closeRatingModal(modal);
        hasShownRatingPrompt = false; // Allow showing again later
    });
}

function closeRatingModal(modal) {
    modal.classList.remove('show');
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

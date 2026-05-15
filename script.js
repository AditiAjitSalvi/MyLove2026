document.addEventListener('DOMContentLoaded', () => {
    // --- Timer Logic (Since May 16, 2023) ---
    const anniversaryDate = new Date('May 16, 2023 00:00:00').getTime();

    function updateTimer() {
        const now = new Date().getTime();
        const difference = now - anniversaryDate;

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minsEl = document.getElementById('minutes');
        const secsEl = document.getElementById('seconds');

        if (daysEl) daysEl.innerText = d.toString().padStart(1, '0'); // Responsive padding
        if (hoursEl) hoursEl.innerText = h.toString().padStart(2, '0');
        if (minsEl) minsEl.innerText = m.toString().padStart(2, '0');
        if (secsEl) secsEl.innerText = s.toString().padStart(2, '0');
    }

    setInterval(updateTimer, 1000);
    updateTimer();

    // --- Adimon Game Puzzle Logic ---
    const word = "ADIMON";
    const scatteredLetters = word.split('').sort(() => Math.random() - 0.5);
    const scatterArea = document.getElementById('scatter-area');
    const targetArea = document.getElementById('target-area');
    const feedback = document.getElementById('game-feedback');
    const modal = document.getElementById('confession-modal');
    const silhouette = document.getElementById('silhouette');
    const confessionText = document.getElementById('confession-text');

    let currentGuess = Array(word.length).fill(null);

    function initGame() {
        scatterArea.innerHTML = '';
        targetArea.innerHTML = '';
        currentGuess = Array(word.length).fill(null);
        feedback.innerText = '';
        feedback.className = 'h-8 text-lg font-medium transition-colors';
        silhouette.classList.remove('revealed');

        scatteredLetters.forEach((letter, i) => {
            const btn = document.createElement('div');
            btn.classList.add('puzzle-letter');
            btn.innerText = letter;
            btn.dataset.letter = letter;
            btn.dataset.id = i;
            btn.addEventListener('click', () => handleLetterClick(btn));
            scatterArea.appendChild(btn);
        });

        for (let i = 0; i < word.length; i++) {
            const slot = document.createElement('div');
            slot.classList.add('slot');
            slot.dataset.index = i;
            slot.addEventListener('click', () => handleSlotClick(slot));
            targetArea.appendChild(slot);
        }
    }

    function handleLetterClick(btn) {
        const firstEmpty = currentGuess.indexOf(null);
        if (firstEmpty === -1) return;

        btn.classList.add('selected');
        currentGuess[firstEmpty] = { letter: btn.dataset.letter, id: btn.dataset.id };

        const slot = targetArea.children[firstEmpty];
        slot.innerText = btn.dataset.letter;
        slot.classList.add('active');

        checkWin();
    }

    function handleSlotClick(slot) {
        const idx = parseInt(slot.dataset.index);
        if (!currentGuess[idx]) return;

        const { id } = currentGuess[idx];
        currentGuess[idx] = null;
        slot.innerText = '';
        slot.classList.remove('active');

        const btn = Array.from(scatterArea.children).find(b => b.dataset.id === id);
        if (btn) btn.classList.remove('selected');

        feedback.innerText = '';
    }

    function checkWin() {
        if (currentGuess.includes(null)) return;

        const guessString = currentGuess.map(g => g.letter).join('');
        if (guessString === word) {
            handleWin();
        } else {
            feedback.innerText = "Order matters! Try again ✨";
            feedback.classList.add('text-rose-400');
        }
    }

    function handleWin() {
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#0f172a', '#fb7185', '#ffffff']
        });

        silhouette.classList.add('revealed');
        feedback.innerText = "Perfectly matched. ❤️";
        feedback.classList.replace('text-rose-400', 'text-green-500');

        setTimeout(() => {
            modal.classList.remove('hidden');
            confessionText.innerHTML = `
                <div class="text-left space-y-6 text-lg lg:text-xl font-light leading-relaxed">
                    <p class="font-playfair italic text-3xl mb-8">The day our story truly began.</p>
                    <p>After almost two years of silently knowing each other in college, destiny decided to make our paths cross in the most dramatic and funniest way possible. I still remember telling our 11th class that the next lecture was off, and suddenly you came from behind with your friend, hit me on the back, and said, “Sorry, I thought you were my friend.” 🤣</p>
                    <p>Who knew that one small moment would become one of my favorite memories forever?</p>
                    
                    <p class="font-semibold text-rose-200">And the most special part?</p>
                    <p>16 May 2023 was also my first day of internship. I had just come home after my introductory meeting when you texted me about that funny incident. Honestly, I never thought someone like you would ever talk to me. You were an NM in chess — smart, confident, admired by everyone — and I was just an ordinary girl.</p>
                    
                    <p>But the day we started talking, something felt different. You listened to me. You understood me. Even when I struggled to understand complicated things — and sometimes even simple ones — you never once made me feel small or dumb. Instead, you stayed patient, kind, and supportive.</p>
                    
                    <p>When I was going through my unemployment phase, you stood beside me without making me feel alone. You understood my silence, my fears, my overthinking, and slowly… you became my second home. 🏡❤️</p>
                    
                    <p>Thank you, my love, for every effort you put into us, for every moment of care, and for loving me the way you do.</p>
                    
                    <div class="pt-8 border-t border-white/20 mt-8">
                        <p class="italic text-2xl font-playfair">Forever grateful for you.</p>
                        <p class="tracking-widest uppercase text-sm mt-2 opacity-70">Your Aditi 💌</p>
                    </div>
                </div>
            `;
        }, 1200);
    }

    // Modal Control
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.classList.add('hidden');
        initGame(); // Reset for a fresh feel
    });

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            initGame();
        }
    });

    initGame();

    // --- Music Logic ---
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = musicBtn.querySelector('i');
    const entryOverlay = document.getElementById('entry-overlay');
    const startBtn = document.getElementById('start-journey');
    let isPlaying = false;

    function toggleMusic() {
        if (isPlaying) {
            music.pause();
            musicIcon.classList.replace('fa-pause', 'fa-music');
            musicBtn.classList.remove('animate-pulse');
        } else {
            music.play().catch(e => console.log("Autoplay blocked, waiting for interaction"));
            musicIcon.classList.replace('fa-music', 'fa-pause');
            musicBtn.classList.add('animate-pulse');
        }
        isPlaying = !isPlaying;
    }

    musicBtn.addEventListener('click', toggleMusic);

    // Entry Interaction to start everything
    startBtn.addEventListener('click', () => {
        entryOverlay.style.opacity = '0';
        setTimeout(() => entryOverlay.remove(), 700);

        // Start music
        toggleMusic();
    });

    // Scroll Progress Loader
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const b = document.body;
        const st = 'scrollTop';
        const sh = 'scrollHeight';
        const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
        const progress = document.getElementById('progress-bar');
        if (progress) progress.style.width = percent + '%';
    });
    // --- Floating Hearts Spawner ---
    function createHeart() {
        const heart = document.createElement('i');
        heart.classList.add('fas', 'fa-heart', 'floating-heart');

        // Randomize
        const colors = ['#ffb6c1', '#ffc0cb', '#fb7185', '#fda4af'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 15 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const delay = Math.random() * 2;

        heart.style.left = left + '%';
        heart.style.fontSize = size + 'px';
        heart.style.color = randomColor;
        heart.style.animationDuration = duration + 's';
        heart.style.animationDelay = delay + 's';
        heart.style.opacity = '0';

        document.body.appendChild(heart);

        // Cleanup after animation ends
        setTimeout(() => {
            heart.remove();
        }, (duration + delay) * 1000 + 100);
    }

    // Spawn hearts every 1s
    setInterval(createHeart, 1000);
});

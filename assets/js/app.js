const logic = new SpinnerLogic();
const spinBtn = document.getElementById('spin');
const generateBtn = document.getElementById('generate');
const surpriseBtn = document.getElementById('surprise');
const resetBtn = document.getElementById('reset-all');
const bigResultContainer = document.getElementById('big-result-container');
const bigResultText = document.getElementById('big-result-text');
const resultLabel = document.querySelector('#big-result-container .label');

const foodPool = [
    "Pizza", "Burger", "Tacos", "Burrito", "Steak", "Pasta", "Greek Salad",
    "Fish & Chips", "Falafel", "Chicken Skewers", "Pancakes",
    "Ramen", "Udon", "Soba", "Curry Rice", "Katsu", "Tempura", "Takoyaki", "Okonomiyaki", "Sushi", "Onigiri",
    "Dim Sum", "Hot Pot", "Xiao Long Bao", "Fried Rice", "Chow Mein", "Kung Pao Chicken", "Mapo Tofu", "Peking Duck", "Dan Dan Noodles",
    "Phở", "Bánh Mì", "Bún Chả", "Spring Rolls", "Cơm Tấm",
    "Bibimbap", "Korean BBQ", "Bulgogi", "Tteokbokki", "Japchae", "Kimchi Fried Rice", "Korean Fried Chicken",
    "Pad Thai", "Thai Curry", "Tom Yum", "Basil Chicken", "Mango Sticky Rice",
    "Biryani", "Butter Chicken", "Tikka Masala", "Samosa", "Masala Dosa",
    "Laksa", "Hainanese Chicken Rice", "Char Kway Teow", "Nasi Lemak",
    "Beef Noodle Soup", "Gua Bao", "Popcorn Chicken"
];

const setStatusText = (text) => {
    const res = document.getElementById('result');
    if (res) res.innerText = text;
};

window.addEventListener('load', () => {
    if (typeof drawEmptyWheel === 'function') drawEmptyWheel();
    spinBtn.disabled = true;
});

// Random Choices Generator
surpriseBtn.addEventListener('click', () => {
    const shuffled = [...foodPool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);

    document.getElementById('choices').value = selected.join('\n');
    generateBtn.click();
    setStatusText("Chef's surprise loaded!");
});

// Update Wheel & Initialize Game
generateBtn.addEventListener('click', () => {
    const rawInput = document.getElementById('choices').value;
    const list = rawInput.split('\n').map(s => s.trim()).filter(s => s);
    const winGoal = parseInt(document.getElementById('bestOf').value) || 1;

    if (list.length < 2) {
        alert("Please add at least 2 options!");
        return;
    }

    logic.reset(list, winGoal);
    currentAngle = 0;
    drawWheel(list);

    spinBtn.disabled = false;
    spinBtn.style.display = 'inline-block';
    bigResultContainer.classList.add('hidden');
    bigResultContainer.classList.remove('final-winner-active'); // Clear flare

    const goalText = winGoal === 1 ? "1 win" : `${winGoal} wins`;
    setStatusText(`Race to ${goalText} started!`);
    updateScoreboard();
});

// Reset Everything
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        document.getElementById('choices').value = '';
        document.getElementById('bestOf').value = 1;
        logic.reset([], 1);
        updateScoreboard();
        bigResultContainer.classList.add('hidden');
        bigResultContainer.classList.remove('final-winner-active');
        spinBtn.disabled = true;
        spinBtn.style.display = 'inline-block';
        setStatusText("Everything cleared. Ready for new ideas!");
        if (typeof drawEmptyWheel === 'function') drawEmptyWheel();
    });
}

// Spin Button Interaction
spinBtn.addEventListener('click', () => {
    if (isSpinning) return;

    spinBtn.disabled = true;
    bigResultContainer.classList.add('hidden');
    setStatusText("Spinning...");

    const extraSpins = (Math.PI * 2) * (5 + Math.random() * 5);

    animateSpin(extraSpins, () => {
        const arc = (2 * Math.PI) / choices.length;
        const offset = (Math.PI * 1.5 - currentAngle) % (Math.PI * 2);
        const index = Math.floor((offset < 0 ? offset + Math.PI * 2 : offset) / arc);

        const winner = choices[index];
        const status = logic.recordWin(winner);

        updateScoreboard();
        bigResultContainer.classList.remove('hidden');

        if (status.isGameOver) {
            resultLabel.innerText = "Final Winner";
            bigResultText.innerText = status.winner;
            setStatusText("Tournament Complete!");
            spinBtn.style.display = 'none';
            bigResultContainer.classList.add('final-winner-active'); // Add pop animation
        } else {
            resultLabel.innerText = "The wheel chose";
            bigResultText.innerText = winner;
            setStatusText(`First to ${logic.targetWins} wins.`);
            spinBtn.disabled = false;
        }
    });
});

// Click text to copy to clipboard
bigResultText.addEventListener('click', () => {
    if (!bigResultText.innerText) return;
    navigator.clipboard.writeText(bigResultText.innerText);
    const originalLabel = resultLabel.innerText;
    resultLabel.innerText = "Copied to clipboard!";
    setTimeout(() => resultLabel.innerText = originalLabel, 2000);
});

function updateScoreboard() {
    const container = document.getElementById('scoreboard');
    if (!container) return;

    const scoreEntries = Object.entries(logic.scores).filter(([_, score]) => score > 0);
    if (scoreEntries.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = scoreEntries
        .map(([name, score]) => `
            <div class="score-tag">
                <span class="score-name">${name}</span>
                <span class="score-count">${score}</span>
            </div>
        `).join('');
}
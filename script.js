let money = 0;
let timeLeft = 0;
let upgradeableTime = 30;
let timerInterval;
let time = 30;
let costs = 10;
let level = 0;
let Exp = 0;
let autoHarvestEnabled = false;
let salary = 10;
let timered = -1;

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    const clickSound = document.getElementById('clickSound');

    clickSound.playbackRate = 1.0;

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            button.classList.add('darker');
            setTimeout(function() {
                button.classList.remove('darker');
            }, 200);

            playSound(clickSound, 0.06);
        });
    });

    document.getElementById("harvestToggle").addEventListener("click", toggleAutoHarvest);
    document.getElementById("Harvest").addEventListener("click", startTimer);
    document.getElementById("upgradeTimer").addEventListener("click", upgradeTimer);
    document.getElementById("testJumpscare").addEventListener("click", Jumpscare);

    startGame();
});

function playSound(audioElement, cutoffPercentage) {
    audioElement.addEventListener('loadedmetadata', function() {
        const cutoffTime = audioElement.duration * cutoffPercentage;
        audioElement.currentTime = cutoffTime;
        audioElement.play();
    }, { once: true });
    audioElement.load();
}

function updateTimer() {
    const timerSpan = document.getElementById("timer");
    timerSpan.textContent = timeLeft > 0 ? timeLeft : upgradeableTime;
    document.getElementById("Harvest").disabled = timeLeft > 0 || autoHarvestEnabled;
}

function updateMoney() {
    document.getElementById("money").textContent = money;
    updateCostStatus();
}

function updateNowTime() {
    document.getElementById("time").textContent = time;
}

function updateUpgradeCosts() {
    document.getElementById("costs").textContent = costs;
}

function updateExp() {
    document.getElementById("Exp").textContent = Exp;
}

function updateSalary() {
    if (level % 5 === 0 && level !== 0) {
        salary += 5;
    }
    document.getElementById("salary").textContent = salary;
}

function updateLevel() {
    let newLevel = Math.floor(Exp / 10);
    if (newLevel !== level) {
        level = newLevel;
        updateSalary();
    }
    document.getElementById("level").textContent = level;
}

function earnMoney() {
    money += salary;
    Exp += 10;
    updateMoney();
    updateExp();
    updateLevel();
}

function upgradeTimer() {
    if (money >= costs) {
        if (time === 1) {
            endGame();
        } else {
            money -= costs;
            time = Math.max(time - 1, 1);
            upgradeableTime = time;
            updateTimer();
            updateMoney();
            updateNowTime();
            updateUpgradeCosts();
        }
    }
}

function startTimer() {
    if (!timerInterval) {
        timeLeft = time;
        updateTimer();
        timerInterval = setInterval(function() {
            timeLeft--;
            updateTimer();
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                earnMoney();
                if (!autoHarvestEnabled) {
                    document.getElementById("Harvest").disabled = false;
                } else {
                    startTimer();
                }
            }
        }, 1000);
    }
}

function toggleAutoHarvest() {
    autoHarvestEnabled = !autoHarvestEnabled;
    const toggleButton = document.getElementById('harvestToggle');
    const statusText = document.getElementById('harvestStatus');
    toggleButton.classList.toggle('on', autoHarvestEnabled);
    toggleButton.classList.toggle('off', !autoHarvestEnabled);
    statusText.textContent = autoHarvestEnabled ? 'Currently Active' : 'Currently Inactive';
    statusText.classList.toggle('on', autoHarvestEnabled);
    statusText.classList.toggle('off', !autoHarvestEnabled);

    if (autoHarvestEnabled) {
        if (!timerInterval) {
            startTimer();
        }
    }
}

function updateCostStatus() {
    const costText = document.getElementById("upgradeCostStatus");
    costText.textContent = `${timered}s cost: $${costs}/${money}`;
    costText.classList.toggle('affordable', money >= costs);
}

function startGame() {
    updateTimer();
    updateMoney();
    updateExp();
    updateLevel();
    updateUpgradeCosts();
    updateSalary();
}

function endGame() {
    Jumpscare();
    setTimeout(() => {
        alert("Game Over!");
        clearInterval(timerInterval);
        timerInterval = null;
        startGame();
    }, 6000); // Delay reset and alert by 2 seconds to allow jumpscare to finish
}


function Jumpscare() {
    const jumpscareGif = document.getElementById('jumpscareGif');
    const jumpscareScream = document.getElementById('jumpscarescream');
    // Display the GIF full screen
    jumpscareGif.style.display = 'block';
    jumpscareGif.style.position = 'fixed';
    jumpscareGif.style.top = 0;
    jumpscareGif.style.left = 0;
    jumpscareGif.style.width = '100%';
    jumpscareGif.style.height = '100%';
    jumpscareGif.style.zIndex = 1000;

    // Ensure sound is ready to play
    jumpscareScream.volume = 1.0;
    jumpscareScream.currentTime = 0; // Restart sound from beginning
    jumpscareScream.play().catch(error => {
        console.error('Error playing jumpscare sound:', error);
    });

    // Remove the GIF after 2 seconds
    setTimeout(() => {
        jumpscareGif.style.display = 'none';
    }, 6000);
}




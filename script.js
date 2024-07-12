let money = 0; // Start money
let timeLeft = 0;
let upgradeableTime = 30; // Downgradable time
let timerInterval;
let time = 30; // Timer who runs down
let costs = 10; // Costs for timer reduction
let level = 0;
let Exp = 0;
let autoHarvestEnabled = false;
let autoHarvestInterval;
let salary = 10; // Start salary
let timered = -1; // Timer reduction

document.addEventListener('DOMContentLoaded', function() {
    // Select all buttons on the page
    const buttons = document.querySelectorAll('button');
    const clickSound = document.getElementById('clickSound');

    // Set playback speed
    clickSound.playbackRate = 1.0; // Normal speed

    // Add click event listener to each button
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Apply the darker class
            button.classList.add('darker');

            // Remove the darker class after 200 milliseconds
            setTimeout(function() {
                button.classList.remove('darker');
            }, 200);

            // Play click sound with 2% cutoff and 1 millisecond delay
            playSoundWithCutoffAndDelay(clickSound, 0.06, );
        });
    });

    // Initialization code for the game
    document.getElementById("harvestToggle").addEventListener("click", function() {
        toggleAutoHarvest();
    });
    document.getElementById("Harvest").addEventListener("click", function() {
        startTimer();
    });
    document.getElementById("upgradeTimer").addEventListener("click", function() {
        upgradeTimer();
    });
    startGame();
});

function playSoundWithCutoffAndDelay(audioElement, cutoffPercentage, delay) {
    audioElement.addEventListener('loadedmetadata', function() {
        const cutoffTime = audioElement.duration * cutoffPercentage;
        audioElement.currentTime = cutoffTime;
        setTimeout(() => {
            audioElement.play();
        }, delay);
    }, { once: true });
    audioElement.load(); // Reload the audio element to ensure metadata is available
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
    if (level % 5 === 0 && level !== 0) {  // Ensure salary increases are triggered correctly
        salary += 5;
    }
    document.getElementById("salary").textContent = salary;
}

function updateLevel() {
    let newLevel = Math.floor(Exp / 10);
    if (newLevel !== level) {
        level = newLevel;
        updateSalary();  // Update salary when level changes
    }
    document.getElementById("level").textContent = level;
}

function earnMoney() {
    money += salary;
    Exp += 10; // Gain experience
    updateMoney();
    updateExp();
    updateLevel();
}

function upgradeTimer() {
    if (money >= costs) {
        money -= costs;
        time = Math.max(time - 1, 1); // Ensure time does not go below 1
        upgradeableTime = time;
        updateTimer();
        updateMoney();
        updateNowTime();
        updateUpgradeCosts();
    }
}

function startTimer() {
    if (!timerInterval) { // Ensure no duplicate intervals
        timeLeft = time; // Reset timeLeft to the current time
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
                    startTimer(); // Restart timer immediately if auto-harvest is enabled
                }
            }
        }, 1000);
    }
}

function toggleAutoHarvest() { // AutoHarvest function for HTML
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
            startTimer(); // Start timer immediately if auto-harvest is enabled and no timer is running
        }
    } else {
        clearInterval(autoHarvestInterval); // Stop auto-harvesting
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
    alert("Game Over!");
    clearInterval(timerInterval);
    clearInterval(autoHarvestInterval);
    timerInterval = null;
    autoHarvestInterval = null;
    startGame(); // Optionally reset the game
}

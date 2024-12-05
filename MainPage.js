document.addEventListener('DOMContentLoaded', () => {
    // Load settings and initialize the game
    loadSettings();
    initializeGame();
  


    // Handling the Settings button
    const settingsButton = document.querySelector('.Settings');
    if (settingsButton) {
        settingsButton.addEventListener('click', () => {
            window.location.href = 'settings.html'; // Navigate to settings.html
        });
    }

    // Handling the New Game button
    const newGameButton = document.querySelector('.NewGame');
    if (newGameButton) {
        newGameButton.addEventListener('click', () => {
            window.location.href = 'FullGame.html'; // Navigate to FullGame.html
        });
    }

    // Handling radio button settings
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const musicRadios = document.querySelectorAll('input[name="music"]');

    if (difficultyRadios.length) difficultyRadios.forEach(radio => radio.addEventListener('change', saveSettings));
    if (modeRadios.length) modeRadios.forEach(radio => radio.addEventListener('change', saveSettings));
    if (musicRadios.length) musicRadios.forEach(radio => radio.addEventListener('change', saveSettings));




    const reloadButton = document.querySelector('.Reload');
    if (reloadButton) { reloadButton.addEventListener('click', reloadGame);


    
    
    } });    
    function reloadGame() { location.reload();  }
// Function to save settings to localStorage
function saveSettings() {
    const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value;
    const mode = document.querySelector('input[name="mode"]:checked')?.value;
    const music = document.querySelector('input[name="music"]:checked')?.value;

    if (difficulty) localStorage.setItem('difficulty', difficulty);
    if (mode) localStorage.setItem('mode', mode);
    if (music) localStorage.setItem('music', music);
  

}

// Function to load saved settings from localStorage
function loadSettings() {
    const savedDifficulty = localStorage.getItem('difficulty');
    const savedMode = localStorage.getItem('mode');
    const savedMusic = localStorage.getItem('music');

    // Apply saved settings to radio buttons
    if (savedDifficulty) {
        const difficultyRadio = document.querySelector(`input[name="difficulty"][value="${savedDifficulty}"]`);
        if (difficultyRadio) difficultyRadio.checked = true;
    }

    if (savedMode) {
        const modeRadio = document.querySelector(`input[name="mode"][value="${savedMode}"]`);
        if (modeRadio) modeRadio.checked = true;
    }

    if (savedMusic) {
        const musicRadio = document.querySelector(`input[name="music"][value="${savedMusic}"]`);
        if (musicRadio) musicRadio.checked = true;
    }


}

// Initialize the memory game based on the selected difficulty
function initializeGame() {
    const difficulty = localStorage.getItem('difficulty') || 'easy'; // Default to 'easy'
    const mode = localStorage.getItem('mode') || 'easy';

    let buttonSelector, modeContainer;
    switch (difficulty) {
        case 'medium':
            buttonSelector = '.buttons2';
            modeContainer = '.MediumMode';
            break;
        case 'hard':
            buttonSelector = '.buttons3';
            modeContainer = '.HardMode';
            break;
        case 'easy':
        default:
            buttonSelector = '.buttons';
            modeContainer = '.EasyMode';
    }

    // Log difficulty and mode selection
    console.log('Selected Difficulty:', difficulty);
    console.log('Button Selector:', buttonSelector);
    console.log('Mode Container:', modeContainer);

    // Hide all modes initially
    const allModes = document.querySelectorAll('.EasyMode, .MediumMode, .HardMode');
    allModes.forEach(container => {
        container.style.display = 'none';
    });

    // Show the selected mode
    const selectedModeElement = document.querySelector(modeContainer);
    if (selectedModeElement) {
        selectedModeElement.style.display = 'grid';
    } else {
        console.error('Mode container not found:', modeContainer);
    }

    // Start the memory game
    if(mode=="medium"){
        handleMemoryGamenumbers(buttonSelector);
    }
 else
 { 
    handleMemoryGame(buttonSelector);

 }
   
}
// Memory Game Logic
function handleMemoryGame(buttonSelector) {
    const buttons = document.querySelectorAll(buttonSelector);
    const colorPairs = buttons.length / 2;

    const colors = generateColors(colorPairs);
    let timeoutID;
    let justStarted = true;
    let nboftry = 0;
    let isFirstClick = true;
    let tempFirstBtn;

    // Shuffle colors array
    shuffleArray(colors);

    // Show all button colors briefly at the beginning
    showAllBtnColor(buttons, colors);

    // Add event listeners to buttons
    buttons.forEach((button, index) => {
        button.addEventListener('click', function () {
            if (justStarted) {
                startTimer();
                justStarted = false;
            }

            // Prevent interaction during timeout
            if (timeoutID) return;

            // Handle the first and second clicks
            if (isFirstClick) {
                if (button.style.backgroundColor) return;

                button.style.backgroundColor = colors[index];
                tempFirstBtn = button;
                isFirstClick = false;
            } else {
                if (button.style.backgroundColor) return;

                button.style.backgroundColor = colors[index];
                nboftry++;
                document.getElementById("nboftriesid").innerText = nboftry;

                if (button.style.backgroundColor === tempFirstBtn.style.backgroundColor) {
                    isFirstClick = true;

                    // Check if all buttons are matched
                    const allMatched = Array.from(buttons).every(btn => btn.style.backgroundColor);
                    if (allMatched) {
                        setTimeout(() => {
                            alert("You Won!");
                            justStarted = true;
                            stopTimer();
                        }, 100);
                    }
                } else {
                    timeoutID = setTimeout(() => {
                        button.style.backgroundColor = "";
                        tempFirstBtn.style.backgroundColor = "";
                        isFirstClick = true;
                        timeoutID = null;
                    }, 1000);
                }
            }
        });
    });

    // Shuffle colors array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Show all button colors briefly
    function showAllBtnColor(buttons, colors) {
        buttons.forEach((button, index) => {
            button.style.backgroundColor = colors[index];
        });

        setTimeout(() => {
            buttons.forEach(button => {
                button.style.backgroundColor = "";
            });
        }, 1000);
    }

    // Generate pairs of colors
    function generateColors(pairs) {
        const baseColors = [
            "#FF5733", "#C70039", "#900C3F", "#581845", "#DAF7A6", "#FFC300", 
            "#FF1493", "#8A2BE2", "#FF6347", "#00FFFF", "#800080", "#FFFF00", 
            "#00FF00", "#0000FF", "#FFD700", "#FF0000", "#808080", "#4B0082", 
            "#800000", "#008080", "#40E0D0", "#D2691E", "#ADFF2F", "#FF8C00", 
            "#F0E68C", "#98FB98", "#D2B48C", "#A52A2A", "#C71585", "#2E8B57", 
            "#7B68EE", "#DC143C", "#FF4500", "#B22222", "#32CD32", "#8B4513", 
            "#191970", "#6A5ACD", "#F4A300", "#B8860B", "#006400", "#4682B4", 
            "#708090", "#D3D3D3", "#FF1493", "#C0C0C0", "#F5FFFA", "#FF7F50", 
            "#8B0000", "#E9967A", "#B0E0E6", "#5F9EA0", "#FF00FF", "#2F4F4F"
        ];
    
        // If more colors are required than available, generate extra colors
        if (pairs > baseColors.length) {
            let extraColors = [];
            for (let i = baseColors.length; i < pairs; i++) {
                let newColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`; // Random hex color
                extraColors.push(newColor);
            }
            baseColors.push(...extraColors);
        }
    
        // Select the required number of colors for pairs
        const selectedColors = baseColors.slice(0, pairs);
    
        // Duplicate and shuffle
        const colors = [...selectedColors, ...selectedColors];
        shuffleArray(colors);
    
        return colors;
    }
    
    // Timer functionality
    let seconds, timer;

    function startTimer() {
        seconds = 1;
        timer = setInterval(() => {
            document.getElementById("timerid").innerText = `${seconds}s`;
            seconds++;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
}


function handleMemoryGamenumbers(buttonSelector) {
    const buttons = document.querySelectorAll(buttonSelector);
    const colorPairs = buttons.length / 2;

    const colors = generateColors(colorPairs);
    let timeoutID;
    let justStarted = true;
    let nboftry = 0;
    let isFirstClick = true;
    let tempFirstBtn;

    // Shuffle colors array
    shuffleArray(colors);

    // Show all button colors briefly at the beginning
    showAllBtnNumbers(buttons, colors);

    // Add event listeners to buttons
    buttons.forEach((button, index) => {
        button.addEventListener('click', function () {
            if (justStarted) {
                startTimer();
                justStarted = false;
            }

            // Prevent interaction during timeout
            if (timeoutID) return;

            // Handle the first and second clicks
            if (isFirstClick) {
                if (button.value!="") return;

                button.value = colors[index];
                tempFirstBtn = button;
                isFirstClick = false;
            } else {
                if (button.value!="") return;

                button.value = colors[index];
                nboftry++;
                document.getElementById("nboftriesid").innerText = nboftry;

                if (button.value === tempFirstBtn.value) {
                    isFirstClick = true;

                    // Check if all buttons are matched
                    const allMatched = Array.from(buttons).every(btn => btn.value);
                    if (allMatched) {
                        setTimeout(() => {
                            alert("You Won!");
                            justStarted = true;
                            stopTimer();
                        }, 100);
                    }
                } else {
                    timeoutID = setTimeout(() => {
                        button.value = "";
                        tempFirstBtn.value = "";
                        isFirstClick = true;
                        timeoutID = null;
                    }, 1000);
                }
            }
        });
    });

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
    // Show all button colors briefly
    function showAllBtnNumbers(buttons, colors) {
        buttons.forEach((button, index) => {
            button.value = colors[index];
        });

        setTimeout(() => {
            buttons.forEach(button => {
                button.value = "";
            });
        }, 1000);
    }

    // Generate pairs of colors
    function generateColors(pairs) {
        const baseColors = [
    "1", "2", "3", "4", "5", "6", 
    "7", "8", "9", "10", "11", "12",
    "13", "14", "15", "16", "17", "18",
    "19", "20", "21", "22", "23", "24", 
    "25", "26", "27", "28", "29", "30",
    "31", "32", "33", "34", "35", "36"
];

        let colors = [];
        for (let i = 0; i < pairs; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        return [...colors, ...colors]; // Duplicate to create pairs
    }

    // Timer functionality
    let seconds, timer;

    function startTimer() {
        seconds = 1;
        timer = setInterval(() => {
            document.getElementById("timerid").innerText = `${seconds}s`;
            seconds++;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
    }
}




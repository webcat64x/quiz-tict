let quizData = {};
let timerInterval = null;
let audioCtx = null; // Audio Context for the beep sound

// DOM Elements
const homeView = document.getElementById('home-view');
const questionView = document.getElementById('question-view');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const questionBox = document.getElementById('question-box');
const topicTag = document.getElementById('topic-tag');
const timerDisplay = document.getElementById('timer-display');

// Initialize Web Audio API context
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// Function to play a short "beep" sound using the Web Audio API
function playBeep(freq = 440, duration = 0.1) {
    try {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'square'; // Sounds like a digital alert
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime); 

        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration); 
    } catch (e) {
        console.log("Audio playback error:", e);
    }
}

// Load JSON database on startup
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
    })
    .catch(error => console.error("Error loading questions database:", error));

// Start button event listener (Timer set to 60 seconds = 1 minute)
startBtn.addEventListener('click', () => {
    pickRandomQuestion();
    switchView(questionView);
    startTimer(60); 
});

// Back button event listener
backBtn.addEventListener('click', () => {
    switchView(homeView);
    stopTimer();
});

// Switch between views
function switchView(targetView) {
    homeView.classList.add('hidden');
    questionView.classList.add('hidden');
    targetView.classList.remove('hidden');
}

// Random selection logic: Topic -> Question
function pickRandomQuestion() {
    const topics = Object.keys(quizData);
    if (topics.length === 0) {
        questionBox.textContent = "Database is loading or empty. Please check your questions.json file.";
        topicTag.textContent = "Error";
        return;
    }

    // 1. Pick a random topic
    const randomTopicIndex = Math.floor(Math.random() * topics.length);
    const selectedTopic = topics[randomTopicIndex];

    // 2. Pick a random question from that topic's array
    const questionsList = quizData[selectedTopic];
    const randomQuestionIndex = Math.floor(Math.random() * questionsList.length);
    const selectedQuestion = questionsList[randomQuestionIndex];

    // Display results
    topicTag.textContent = selectedTopic;
    questionBox.textContent = selectedQuestion;
}

// Timer Logic
function startTimer(duration) {
    let timer = duration;
    updateTimerDisplay(timer);

    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay(timer);

        // Beep for the last 10 seconds (10, 9, 8, ..., 1)
        if (timer > 0 && timer <= 10) {
            playBeep(440, 0.1); // Short 100ms beep
        }
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's Up!";
            playBeep(660, 0.5); // Slightly longer, higher pitch tone when time runs out completely
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    
    timerDisplay.textContent = `Time Left: ${displayMinutes}:${displaySeconds}`;

    // Optional: Make the timer stand out more visually during the last 10 seconds
    if (seconds <= 10) {
        timerDisplay.style.color = "#e74c3c"; // Turns bright red
    } else {
        timerDisplay.style.color = ""; // Resets to default color (defined in CSS)
    }
}

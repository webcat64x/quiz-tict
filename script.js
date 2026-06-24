let quizData = {};
let timerInterval = null;

// DOM Elements
const homeView = document.getElementById('home-view');
const questionView = document.getElementById('question-view');
const startBtn = document.getElementById('start-btn');
const backBtn = document.getElementById('back-btn');
const questionBox = document.getElementById('question-box');
const topicTag = document.getElementById('topic-tag');
const timerDisplay = document.getElementById('timer-display');

// Load JSON database on startup
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        quizData = data;
    })
    .catch(error => console.error("Error loading questions database:", error));

// Start button event listener
startBtn.addEventListener('click', () => {
    pickRandomQuestion();
    switchView(questionView);
    startTimer(60); // 60 seconds = 1 minute
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

// 3-Minute Timer Logic
function startTimer(duration) {
    let timer = duration;
    updateTimerDisplay(timer);

    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay(timer);
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            timerDisplay.textContent = "Time's Up!";
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
}
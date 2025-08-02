// Memory Flip Card Game
// Adjustable difficulty, move tracking, smooth animations

document.addEventListener('DOMContentLoaded', () => {
  const difficulties = {
    easy: { rows: 2, cols: 3 },
    medium: { rows: 3, cols: 4 },
    hard: { rows: 4, cols: 6 }
  };
  const symbols = [
    '🍎','🍌','🍇','🍉','🍒','🍋','🍓','🍑','🍍','🥝','🥥','🍊',
    '🍈','🍐','🍏','🥭','🍅','🥑','🥕','🌽','🍆','🥔','🥦','🧄'
  ];

  const gameContainer = document.getElementById('game-container');
  const moveCounter = document.getElementById('move-counter');
  const difficultySelect = document.getElementById('difficulty');
  const restartBtn = document.getElementById('restart');

  let board = [];
  let flipped = [];
  let matched = [];
  let moves = 0;
  let lock = false;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function createBoard(difficulty) {
    const { rows, cols } = difficulties[difficulty];
    const total = rows * cols;
    let pairs = total / 2;
    let chosen = shuffle(symbols.slice(0, pairs));
    let cards = shuffle([...chosen, ...chosen]);
    board = cards;
    matched = Array(total).fill(false);
    flipped = [];
    moves = 0;
    moveCounter.textContent = 'Moves: 0';
    renderBoard(rows, cols);
  }

  function renderBoard(rows, cols) {
    gameContainer.innerHTML = '';
    gameContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    gameContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    gameContainer.style.display = 'grid';
    gameContainer.style.gap = '10px';
    for (let i = 0; i < board.length; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      if (matched[i]) card.classList.add('matched');
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-front"></div>
          <div class="card-back">${board[i]}</div>
        </div>
      `;
      card.addEventListener('click', () => flipCard(i));
      if (flipped.includes(i) || matched[i]) {
        card.classList.add('flipped');
      }
      gameContainer.appendChild(card);
    }
  }

  function flipCard(idx) {
    if (lock || flipped.includes(idx) || matched[idx]) return;
    flipped.push(idx);
    renderBoard(
      difficulties[difficultySelect.value].rows,
      difficulties[difficultySelect.value].cols
    );
    if (flipped.length === 2) {
      moves++;
      moveCounter.textContent = `Moves: ${moves}`;
      const [a, b] = flipped;
      if (board[a] === board[b]) {
        matched[a] = matched[b] = true;
        flipped = [];
        if (matched.every(Boolean)) {
          setTimeout(() => alert(`Congratulations! You won in ${moves} moves.`), 500);
        }
      } else {
        lock = true;
        setTimeout(() => {
          flipped = [];
          renderBoard(
            difficulties[difficultySelect.value].rows,
            difficulties[difficultySelect.value].cols
          );
          lock = false;
        }, 900);
      }
    }
  }

  difficultySelect.addEventListener('change', () => {
    createBoard(difficultySelect.value);
  });
  restartBtn.addEventListener('click', () => {
    createBoard(difficultySelect.value);
  });

  createBoard(difficultySelect.value);
});
const cardsArray = ['🍎', '🍌', '🍓', '🍇', '🍍', '🍑']; // Use emojis or images
let gameCards = [...cardsArray, ...cardsArray]; // duplicate for pairs
let flippedCards = [];
let matched = 0;
let moves = 0;
let timerStarted = false;
let time = 0;
let timerInterval;

const grid = document.querySelector('.card-grid');
const moveCount = document.getElementById('moveCount');
const timerDisplay = document.getElementById('timer');
const starsDisplay = document.getElementById('stars');

// Shuffle using Fisher-Yates
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  gameCards = shuffle(gameCards);
  grid.innerHTML = '';
  matched = 0;
  moves = 0;
  time = 0;
  timerStarted = false;
  clearInterval(timerInterval);
  moveCount.textContent = 0;
  timerDisplay.textContent = "00:00";
  starsDisplay.textContent = "★★★";

  gameCards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">❓</div>
        <div class="card-back">${symbol}</div>
      </div>
    `;
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });
}

function flipCard(card) {
  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  }

  if (
    card.classList.contains('flipped') ||
    flippedCards.length === 2
  ) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    moveCount.textContent = moves;
    updateStars();

    const [first, second] = flippedCards;
    if (first.dataset.symbol === second.dataset.symbol) {
      flippedCards = [];
      matched++;
      if (matched === cardsArray.length) {
        clearInterval(timerInterval);
        setTimeout(() => alert("🎉 You won!"), 500);
      }
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        flippedCards = [];
      }, 800);
    }
  }
}

function updateTimer() {
  time++;
  const mins = String(Math.floor(time / 60)).padStart(2, '0');
  const secs = String(time % 60).padStart(2, '0');
  timerDisplay.textContent = `${mins}:${secs}`;
}

function updateStars() {
  if (moves <= 12) {
    starsDisplay.textContent = "★★★";
  } else if (moves <= 20) {
    starsDisplay.textContent = "★★☆";
  } else {
    starsDisplay.textContent = "★☆☆";
  }
}

document.getElementById('restartBtn').addEventListener('click', startGame);

startGame(); // initialize

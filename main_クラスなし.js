"use strict";

const board = document.getElementById("board");
const timer = document.getElementById("timer");
const btn = document.getElementById("btn");

const LEVEL = 5;
const CELL_COUNT = LEVEL * LEVEL;

let numbers = [];
let current = 0;
let startTime;
let timeoutId;

/* =========================
   レイアウト設定（5×5幅）
   ========================= */
function setupLayout(level) {
  const container = document.getElementById("container");
  const PANEL_WIDTH = 50;
  const BOARD_PADDING = 10;

  container.style.width = PANEL_WIDTH * level + BOARD_PADDING * 2 + "px";
}

/* =========================
   空の盤面を作る（最初に1回）
   ========================= */
function createEmptyBoard() {
  board.innerHTML = "";

  for (let i = 0; i < CELL_COUNT; i++) {
    const li = document.createElement("li");
    board.appendChild(li);
  }
}

/* =========================
   数字を配置してゲーム開始
   ========================= */
function setupGame() {
  numbers = [];
  current = 0;

  for (let i = 0; i < CELL_COUNT; i++) {
    numbers.push(i);
  }

  shuffle(numbers);

  const cells = document.querySelectorAll("#board li");

  cells.forEach((cell, index) => {
    cell.textContent = numbers[index];
    cell.classList.remove("pressed");

    cell.onclick = () => {
      if (numbers[index] === current) {
        cell.classList.add("pressed");
        current++;

        if (current === CELL_COUNT) {
          clearTimeout(timeoutId);
        }
      }
    };
  });
}

/* =========================
   STARTボタン
   ========================= */
btn.addEventListener("click", () => {
  setupGame();
  startTime = Date.now();
  runTimer();
});

/* =========================
   タイマー
   ========================= */
function runTimer() {
  timer.textContent = ((Date.now() - startTime) / 1000).toFixed(2);
  timeoutId = setTimeout(runTimer, 10);
}

/* =========================
   シャッフル
   ========================= */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/* =========================
   初期化（ページ読み込み時）
   ========================= */
setupLayout(LEVEL);
createEmptyBoard();

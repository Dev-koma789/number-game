"use strict";
// 厳格モード
// 変数の宣言漏れなどをエラーにしてくれる安全装置

/* =========================
   Game（全体管理クラス）
   ========================= */
class Game {
  constructor(level) {
    // --- ゲーム設定 ---
    this.level = level; // 縦横のマス数（例：5）
    this.cellCount = level * level; // マスの総数（5×5 = 25）
    this.current = 0; // 次に押すべき数字
    this.isPlaying = false; // ゲーム中かどうかのフラグ

    // --- DOM要素 ---
    this.timerEl = document.getElementById("timer"); // タイマー表示
    this.btn = document.getElementById("btn"); // STARTボタン

    // --- タイマー管理 ---
    this.startTime = 0; // 開始時刻
    this.timeoutId = null; // setTimeout のID

    // レイアウト（幅）をレベルに応じて設定
    this.setupLayout();

    // 盤面（Board）を作成
    this.board = new Board(this);

    // STARTボタンが押されたらゲーム開始
    this.btn.addEventListener("click", () => {
      this.start();
    });
  }

  // ゲーム開始処理
  start() {
    // すでにプレイ中なら何もしない（二重起動防止）
    if (this.isPlaying) return;

    this.isPlaying = true; // ゲーム開始状態にする
    this.current = 0; // 押す数字を0からに戻す

    this.board.setup(); // 盤面に数字を配置
    this.startTime = Date.now(); // 開始時刻を記録
    this.runTimer(); // タイマー開始
  }

  // タイマーを動かし続ける処理
  runTimer() {
    // 経過時間を秒で表示（小数点2桁）
    this.timerEl.textContent = ((Date.now() - this.startTime) / 1000).toFixed(
      2
    );

    // 10msごとに自分自身を呼び直す
    this.timeoutId = setTimeout(() => {
      this.runTimer();
    }, 10);
  }

  // 正解のマスが押されたときに呼ばれる
  correct() {
    this.current++; // 次に押す数字を進める

    // 全マス押し終わったらゲーム終了
    if (this.current === this.cellCount) {
      clearTimeout(this.timeoutId); // タイマー停止
      this.timeoutId = null;
      this.isPlaying = false; // 再スタート可能にする
    }
  }

  // レイアウト（横幅）を設定する
  setupLayout() {
    const container = document.getElementById("container");

    const PANEL_WIDTH = 50; // マス1個分の幅
    const BOARD_PADDING = 10; // 余白

    // level個分の幅を持つコンテナにする
    container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + "px";
  }
}

/* =========================
   Panel（1マスを表すクラス）
   ========================= */
class Panel {
  constructor(game, number) {
    this.game = game; // Gameインスタンスへの参照
    this.number = number; // このマスに入る数字

    // li要素（1マス）を作成
    this.el = document.createElement("li");

    // マスがクリックされたときの処理
    this.el.onclick = () => {
      this.check();
    };
  }

  // 数字をセットする（ゲーム開始時に呼ばれる）
  setNumber(num) {
    this.number = num; // 数字を記憶
    this.el.textContent = num; // 表示する
    this.el.classList.remove("pressed"); // 押された見た目をリセット
  }

  // マスが押されたときの判定
  check() {
    // 今押すべき数字と一致していれば正解
    if (this.number === this.game.current) {
      this.el.classList.add("pressed"); // 押された見た目にする
      this.game.correct(); // Gameに「正解した」と伝える
    }
  }

  // BoardがDOMに追加するために使う
  getElement() {
    return this.el;
  }
}

/* =========================
   Board（盤面全体を管理）
   ========================= */
class Board {
  constructor(game) {
    this.game = game; // Gameへの参照
    this.boardEl = document.getElementById("board"); // ul要素
    this.panels = []; // Panelの配列

    // 最初に空の盤面（25マス）を作る
    this.createEmptyBoard();
  }

  // 空のマスをlevel×level個作る
  createEmptyBoard() {
    this.boardEl.innerHTML = ""; // 一度クリア
    this.panels = [];

    for (let i = 0; i < this.game.cellCount; i++) {
      const panel = new Panel(this.game, null);
      this.panels.push(panel); // 配列で管理
      this.boardEl.appendChild(panel.getElement()); // DOMに追加
    }
  }

  // ゲーム開始時のセットアップ
  setup() {
    const numbers = [];

    // 0〜24の数字を作る
    for (let i = 0; i < this.game.cellCount; i++) {
      numbers.push(i);
    }

    // 数字をシャッフル
    this.shuffle(numbers);

    // 各マスに数字を割り当てる
    this.panels.forEach((panel, index) => {
      panel.setNumber(numbers[index]);
    });
  }

  // 配列をランダムに並び替える（フィッシャーイェーツ）
  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
}

/* =========================
   初期化（ゲーム生成）
   ========================= */
new Game(5); // 5×5のゲームを開始

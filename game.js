(function (global) {
  "use strict";

  var DIRS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
  };

  function opposite(a, b) {
    return a.x === -b.x && a.y === -b.y;
  }

  function cloneSnake(snake) {
    return snake.map(function (part) {
      return { x: part.x, y: part.y };
    });
  }

  function pickFood(rows, cols, snake, rng) {
    var total = rows * cols;
    if (snake.length >= total) return null;

    var occupied = new Set();
    snake.forEach(function (part) {
      occupied.add(part.x + "," + part.y);
    });

    var start = Math.floor(rng() * total);
    for (var i = 0; i < total; i++) {
      var idx = (start + i) % total;
      var x = idx % cols;
      var y = Math.floor(idx / cols);
      var key = x + "," + y;
      if (!occupied.has(key)) {
        return { x: x, y: y };
      }
    }

    return null;
  }

  function createGame(opts) {
    var rows = opts.rows;
    var cols = opts.cols;
    var rng = typeof opts.rng === "function" ? opts.rng : Math.random;

    var state = {
      rows: rows,
      cols: cols,
      snake: [],
      dir: DIRS.right,
      nextDir: DIRS.right,
      food: null,
      score: 0,
      alive: true,
      paused: false,
      started: false,
    };

    function reset() {
      var cx = Math.floor(cols / 2);
      var cy = Math.floor(rows / 2);
      state.snake = [
        { x: cx, y: cy },
        { x: cx - 1, y: cy },
        { x: cx - 2, y: cy },
      ];
      state.dir = DIRS.right;
      state.nextDir = DIRS.right;
      state.score = 0;
      state.alive = true;
      state.paused = false;
      state.started = false;
      state.food = pickFood(rows, cols, state.snake, rng);
    }

    function start() {
      if (state.alive) state.started = true;
    }

    function setDirection(name) {
      var next = DIRS[name];
      if (!next) return;
      if (opposite(next, state.dir)) return;
      state.nextDir = next;
      state.started = true;
    }

    function togglePause() {
      if (!state.alive) return;
      state.paused = !state.paused;
    }

    function step() {
      if (!state.alive || state.paused || !state.started) return;

      state.dir = state.nextDir;
      var head = state.snake[0];
      var nextHead = { x: head.x + state.dir.x, y: head.y + state.dir.y };

      if (
        nextHead.x < 0 ||
        nextHead.x >= cols ||
        nextHead.y < 0 ||
        nextHead.y >= rows
      ) {
        state.alive = false;
        return;
      }

      for (var i = 0; i < state.snake.length; i++) {
        if (state.snake[i].x === nextHead.x && state.snake[i].y === nextHead.y) {
          state.alive = false;
          return;
        }
      }

      var nextSnake = [nextHead].concat(cloneSnake(state.snake));
      var ate = state.food && nextHead.x === state.food.x && nextHead.y === state.food.y;

      if (ate) {
        state.score += 1;
        state.food = pickFood(rows, cols, nextSnake, rng);
      } else {
        nextSnake.pop();
      }

      state.snake = nextSnake;
    }

    reset();

    return {
      getState: function () {
        return state;
      },
      reset: reset,
      start: start,
      setDirection: setDirection,
      togglePause: togglePause,
      step: step,
    };
  }

  global.SnakeGame = {
    createGame: createGame,
  };
})(window);

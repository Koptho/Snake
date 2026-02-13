(function () {
  "use strict";

  var gameScreen = document.getElementById("gameScreen");
  var gameOverScreen = document.getElementById("gameOverScreen");
  var dangerButton = document.getElementById("dangerButton");
  var restartButton = document.getElementById("restartButton");

  function showGameOver() {
    gameScreen.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
  }

  function restartGame() {
    gameOverScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    dangerButton.classList.remove("pressed");
  }

  dangerButton.addEventListener("click", function () {
    dangerButton.classList.add("pressed");
    setTimeout(showGameOver, 180);
  });

  restartButton.addEventListener("click", restartGame);
})();

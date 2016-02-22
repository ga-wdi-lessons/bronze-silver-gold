"use strict";

(function(){
  window.onload = function(){
    var board = new Board();
  }
  function Game(totalCells){
    var game = this;
    game.dimensions = Math.sqrt(totalCells);
    if(game.dimensions % 1 !== 0) throw new Error("The board's not Cell.");
    game.currentPlayer = null;
    game.changePlayer();
  }
  Game.prototype.changePlayer = function(){
    var game = this;
    if(game.currentPlayer === 1) game.currentPlayer = 2;
    else game.currentPlayer = 1;
  }
  Game.prototype.detectWinner = function(positions){
    var game = this;
    var total = positions.length;
    var sequences = [];
    game.winningCells = [];
    checkHorizontally();
    checkVertically();
    checkNWSE();
    checkNESW();
    sequences.forEach(function(sequence){
      if(sequence.length === game.dimensions) game.winningCells.push(sequence);
    });

    function checkVertically(){
      var x, y, base, matches;
      for(x = 0; x < game.dimensions; x++){
        base = positions[x];
        matches = [x];
        for(y = x + game.dimensions; y < total; y += game.dimensions){
          if(base && positions[y] === base) matches.push(y);
        }
        sequences.push(matches);
      }
    }
    function checkHorizontally(){
      var x, y, base, matches;
      for(y = 0; y < total; y += game.dimensions){
        base = positions[y];
        matches = [y];
        for(x = y + 1; x < y + game.dimensions; x++){
          if(base && positions[x] === base) matches.push(x);
        }
        sequences.push(matches);
      }
    }
    function checkNWSE(){
      var x = 0;
      var base = positions[x];
      var matches = [];
      for(x; x < total; x += (game.dimensions + 1)){
        if(base && positions[x] === base) matches.push(x);
      }
      sequences.push(matches);
    }
    function checkNESW(){
      var x = game.dimensions - 1;
      var base = positions[x];
      var matches = [];
      for(x; x < total - game.dimensions + 1; x += (game.dimensions - 1)){
        if(base && positions[x] === base) matches.push(x);
      }
      sequences.push(matches);
    }
  }

  function Board(){
    var board = this;
    board.game = null;
    board.info = document.getElementById("info");
    board.cells = document.querySelectorAll("td");
    board.locked = false;
    board.forEachCell(function(cell){
      cell.addEventListener("click", cellAction);
    });
    document.getElementById("reset").addEventListener("click", function(){
      board.reset();
    });
    board.reset();

    function cellAction(){
      var cell = this;
      if(!board.locked && !cell.hasAttribute("data-player")){
        cell.setAttribute("data-player", board.game.currentPlayer);
        board.newTurn();
      }
    }
  }
  Board.prototype.forEachCell = function(callback){
    var board = this;
    var i, l = board.cells.length;
    for(i = 0; i < l; i++){
      callback(board.cells[i]);
    }
  }
  Board.prototype.newTurn = function(){
    var board = this;
    var positions = [];
    board.forEachCell(function(cell){
      positions.push(cell.getAttribute("data-player"));
    });
    board.game.detectWinner(positions);
    if(board.game.winningCells.length > 0){
      board.locked = true;
      board.info.classList.add("won");
      board.highlightCells(board.game.winningCells);
    }else{
      board.game.changePlayer();
      board.info.setAttribute("data-player", board.game.currentPlayer);
    }
  }
  Board.prototype.highlightCells = function(cells){
    var board = this;
    cells.forEach(function(sequence){
      sequence.forEach(function(cellNum){
        board.cells[cellNum].classList.add("won");
      });
    });
  }
  Board.prototype.reset = function(){
    var board = this;
    board.locked = false;
    board.info.classList.remove("won");
    board.forEachCell(function(cell){
      cell.removeAttribute("data-player");
      cell.classList.remove("won");
    });
    board.game = new Game(board.cells.length);
    board.newTurn();
  }
})();

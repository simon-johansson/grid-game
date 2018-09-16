import GameBoard from "./GameBoard";
import { gameBoardLayout } from "./gameBoardSetup";
import Selection from "./Selection";

const GAME_BOARD_ROWS = 5;
const GAME_BOARD_COLS = 5;
const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const selection = new Selection();
const gameBoard: GameBoard = new GameBoard(
  gameBoardLayout,
  GAME_BOARD_ROWS,
  GAME_BOARD_COLS,
  canvas.width,
  canvas.height,
  {
    toggleOnOverlap: true
  }
);
const elTurnsMade = document.getElementById("turns");
let turnsMade = 0;

function init() {
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  draw();
}

function mouseDown(e: MouseEvent) {
  selection.start(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
}

function mouseUp() {
  updateTurns(gameBoard.evaluateSelection(selection));
  selection.stop();
}

function mouseMove(e: MouseEvent) {
  selection.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
}

function updateTurns(counter: number) {
  elTurnsMade.textContent = `${turnsMade += counter}`;
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameBoard.setSelection(selection);
  gameBoard.draw(ctx);
  selection.draw(ctx);
}

init();

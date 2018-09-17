import GameBoard from "./GameBoard";
import { gameBoardLayouts } from "./gameBoardSetup";
import Selection from "./Selection";
import { getQueryStringParams } from "./utils";

class App {

}

const GAME_BOARD_ROWS = 5;
const GAME_BOARD_COLS = 5;
const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const selection = new Selection();
const elOptimalMoves = document.getElementById("optimal");
const elTurnsMade = document.getElementById("turns");
const elNextBtn = document.getElementById("next");
let turnsMade = 0;

let customLayout = false;
try {
  customLayout = JSON.parse(getQueryStringParams(window.location.search).layout);
} catch (error) {}

let level = 0;
try {
  level = JSON.parse(getQueryStringParams(window.location.search).level);
} catch (error) {}

const gameBoard: GameBoard = new GameBoard(
  customLayout || gameBoardLayouts[level].layout,
  GAME_BOARD_ROWS,
  GAME_BOARD_COLS,
  canvas.width,
  canvas.height,
  {
    toggleOnOverlap: true
  }
);

function init() {
  canvas.addEventListener("mousedown", mouseDown, false);
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  if (level >= gameBoardLayouts.length - 1) {
    elNextBtn.style.display = "none";
  } else {
    elNextBtn.addEventListener("click", nextLevel, false);
  }
  elOptimalMoves.textContent = !!gameBoardLayouts[level] && !customLayout ? gameBoardLayouts[level].optimalMoves : "??";
  draw();

  // selection.start(1, 1);
  // selection.move(499, 499);
  // console.log(selection);
  // console.log(gameBoard.evaluateSelection(selection));
}

function mouseDown(e: MouseEvent) {
  // console.log(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);

  selection.start(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
}

function mouseUp() {
  // console.log(selection);

  updateTurns(gameBoard.evaluateSelection(selection));
  selection.stop();
}

function mouseMove(e: MouseEvent) {
  // console.log(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);

  selection.move(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
}

function nextLevel(): void {
  let l = 0;
  try {
    l = JSON.parse(getQueryStringParams(window.location.search).level);
  } catch (error) {}
  window.location.href = `${window.location.origin}?level=${l + 1}`;
}

function updateTurns(obj: any) {
  // console.log(obj);
  const counter = obj.validMove ? 1 : 0;
  elTurnsMade.textContent = `${(turnsMade += counter)}`;
}

function draw() {
  requestAnimationFrame(draw);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameBoard.setSelection(selection);
  gameBoard.draw(ctx);
  selection.draw(ctx);
}

init();

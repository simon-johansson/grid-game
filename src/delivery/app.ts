import {
  IGameLevel,
  IGameRules,
  IGridLayout,
  ISelectionPresenterConstructor,
  ITilePresenterConstructor
} from "../domain/boundaries/input";
import { IGameState } from "../domain/boundaries/output";
import GameInteractor from "../domain/GameInteractor";
import MovesLeft from "./components/MovesLeft";
import { gameBoardLayouts } from "./data/levels";
import CanvasProvider from "./game_presenters/CanvasProvider";
import SelectionPresenter from "./game_presenters/SelectionPresenter";
import TileBlockerPresenter from "./game_presenters/TileBlockerPresenter";
import TileFlippablePresenter from "./game_presenters/TileFlippablePresenter";
import TileMultiFlipPresenter from "./game_presenters/TileMultiFlipPresenter";
import { getQueryStringParams } from "./utils";

class App {
  private gameInteractor: GameInteractor = new GameInteractor(
    SelectionPresenter,
    TileFlippablePresenter,
    TileBlockerPresenter,
    TileMultiFlipPresenter
  );
  private defaultRules: IGameRules = {};
  private mouseIsDown: boolean = false;
  private queryStringParams: any = getQueryStringParams(window.location.search);
  private queryStringLayout: IGridLayout;
  private currentLevel: number = 0;
  private movesMade: number = 0;
  private canvasProvider: CanvasProvider = CanvasProvider.Instance;
  private $elMovesLeft: HTMLElement = document.getElementById("moves-left");
  private $elMovesMade: HTMLElement = document.getElementById("moves-made");
  private $elNextBtn: HTMLElement = document.getElementById("next");
  private elApp: HTMLElement = document.getElementById("app");

  public init = (): void => {
    this.bindEvents();
    this.analyseQueryString();
    this.createGame();
    this.setGameInfo();
  };

  private bindEvents = (): void => {
    const addCanvasListener = (eventType: string, onEventActionFn: any, proxyFn?: any) =>
      this.canvasProvider.SELECTION_CANVAS.addEventListener(
        eventType,
        proxyFn ? proxyFn.bind(this, onEventActionFn) : onEventActionFn,
        false
      );

    addCanvasListener("mousedown", this.onSelectionStart, this.onMouseSelection);
    addCanvasListener("mousemove", this.onSelectionMove, this.onMouseSelection);
    addCanvasListener("mouseup", this.onSelectionEnd);

    addCanvasListener("touchstart", this.onSelectionStart, this.onTouchSelection);
    addCanvasListener("touchmove", this.onSelectionMove, this.onTouchSelection);
    addCanvasListener("touchend", this.onSelectionEnd);

    this.$elNextBtn.addEventListener("click", this.goTonextLevel, false);
  };

  private analyseQueryString = (): void => {
    try {
      this.queryStringLayout = JSON.parse(this.queryStringParams.layout) as IGridLayout;
    } catch (error) {}

    try {
      this.currentLevel = JSON.parse(this.queryStringParams.level) as number;
    } catch (error) {}

    try {
      this.defaultRules.toggleOnOverlap = JSON.parse(this.queryStringParams.toggleOnOverlap) as boolean;
    } catch (error) {}

    try {
      this.defaultRules.minSelection = JSON.parse(this.queryStringParams.minSelection) as number;
    } catch (error) {}
  };

  private createGame = (): void => {
    const level = this.getGameBoardLayout();
    level.rules = level.rules || {};
    Object.assign(level.rules, this.defaultRules);

    this.gameInteractor.startLevel(level);
  };

  private setGameInfo = (): void => {
    if (this.currentLevel >= gameBoardLayouts.length - 1) {
      this.$elNextBtn.style.display = "none";
    }

    if (!!gameBoardLayouts[this.currentLevel] && !this.queryStringLayout) {
      this.$elMovesLeft.textContent = `${gameBoardLayouts[this.currentLevel].moves}`;
      this.$elMovesMade.style.display = "none";
    } else {
      this.$elMovesLeft.style.display = "none";
    }
  };

  private updateGameInfo = (gameState: any): void => {
    if (typeof gameState.selectionsLeft === "undefined") {
      this.$elMovesMade.textContent = `${gameState.selectionsMade.valid}`;
    } else {
      this.$elMovesLeft.textContent = `${gameState.selectionsLeft}`;
    }
  };

  private getGameBoardLayout = (): IGameLevel => {
    if (this.queryStringLayout) {
      return {
        layout: this.queryStringLayout
      };
    } else {
      return gameBoardLayouts[this.currentLevel];
    }
  };

  private onMouseSelection = (method: (x: number, y: number) => void, e: MouseEvent): void => {
    method(e.offsetX, e.offsetY);
  };

  private onTouchSelection = (method: (x: number, y: number) => void, e: TouchEvent): void => {
    e.preventDefault();
    const offsetLeft = this.canvasProvider.offsetLeft;
    const offsetTop = this.canvasProvider.offsetTop;
    method(Math.floor(e.touches[0].clientX - offsetLeft), Math.floor(e.touches[0].clientY - offsetTop));
  };

  private onSelectionStart = (x: number, y: number): void => {
    this.mouseIsDown = true;
    this.gameInteractor.setSelectionStart(this.convertAbsoluteOffsetToProcent(x), this.convertAbsoluteOffsetToProcent(y));
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.mouseIsDown) {
      this.gameInteractor.setSelectionEnd(this.convertAbsoluteOffsetToProcent(x), this.convertAbsoluteOffsetToProcent(y));
    }
  };

  private onSelectionEnd = (): void => {
    this.mouseIsDown = false;
    const gameState = this.gameInteractor.evaluateSelection();
    // this.render(gameState);

    if (gameState.cleared && !(this.currentLevel >= gameBoardLayouts.length - 1) && !this.queryStringLayout) {
      setTimeout(() => {
        this.goTonextLevel();
      }, 500);
      return;
    }

    if (gameState.selectionsLeft === 0) {
      setTimeout(() => {
        location.reload();
      }, 500);
      return;
    }
  };

  private render(gameState: IGameState): void {
    this.elApp.innerHTML = `
      ${MovesLeft.render(gameState.selectionsLeft, gameState.selectionsMade.valid)}

      <div class="canvas-container">
        ${CanvasProvider.Instance.TILE_CANVAS}
        ${CanvasProvider.Instance.SELECTION_CANVAS}
      </div>

      <div class="button-container">
        <span onclick="location.reload();">
          Reset 🔁
        </span>
        <span id="next">
          Next ➡️
        </span>
      </div>
    `;
  }

  private goTonextLevel = (): void => {
    window.location.href = `${window.location.origin}?level=${this.currentLevel + 1}`;
  };

  private convertAbsoluteOffsetToProcent = (position: number) =>
    Math.floor((position / CanvasProvider.Instance.canvasSize) * 100);
}

const app = new App();
app.init();

import Interactor, { IPresenters } from "@application/Interactor";
import { getSelectionPresenter, getTilePresenter } from "../../game_presenters/index";
import CanvasElementHandler, { NextLevelDirection } from "./CanvasElementHandler";

export default abstract class GameBoard {
  protected wrapperElement: HTMLElement = document.getElementById("canvas-container") as HTMLElement;
  protected innerWrapperClass = "inner-wrapper";
  protected tileCanvasClass = "tile-canvas";
  protected selectionCanvasClass = "selection-canvas";
  protected isTransitioningBetweenLevels: boolean = false;
  private cancelEvents: boolean = false;
  private isSelecting: boolean = false;
  private canvasHandler: CanvasElementHandler;

  constructor(protected interactor: Interactor, levelID?: string) {
    this.canvasHandler = new CanvasElementHandler(
      this.wrapperElement,
      this.innerWrapperClass,
      this.tileCanvasClass,
      this.selectionCanvasClass,
    );
    this.canvasHandler.createInitialElements();
    this.bindEvents();
    // TODO: Ladda banorna någon annan stans, mer top level
    this.interactor.loadLevels().then(() => {
      this.startLevel(levelID);
    });
  }

  protected abstract startLevel(levelID?: string): void;
  protected abstract processSelectionStart(x: number, y: number): void;
  protected abstract processSelectionMove(x: number, y: number): void;
  protected abstract processSelectionEnd(): void;

  protected convertAbsoluteOffsetToProcent = (position: number) =>
    Math.floor((position / this.canvasHandler.canvasSize) * 100);

  protected getPresenters(): IPresenters {
    // TODO: Gör detta dynamiskt, har tillgång till gamestate
    const tileSize = Math.floor(this.canvasHandler.canvasSize / 5);

    return {
      selection: getSelectionPresenter(this.canvasHandler.selectionCanvasContext, tileSize),
      tile: getTilePresenter(this.canvasHandler.tileCanvasContext, tileSize),
    };
  }

  protected async newLevel(direction: NextLevelDirection, getLevelFromInteractor: () => void): Promise<void> {
    if (!this.isTransitioningBetweenLevels) {
      this.isTransitioningBetweenLevels = true;
      this.canvasHandler.prepareNewLevel(direction);
      this.cancelEvents = true;
      await getLevelFromInteractor();
      await this.canvasHandler.showNewLevel(direction);
      this.cancelEvents = false;
      this.isTransitioningBetweenLevels = false;
    }
  }

  private bindEvents(): void {
    const addCanvasListener = (eventType: string, onEventActionFn: any, proxyFn?: any) =>
      this.wrapperElement.addEventListener(
        eventType,
        proxyFn ? proxyFn.bind(this, onEventActionFn) : onEventActionFn.bind(this),
        false,
      );

    addCanvasListener("mousedown", this.onSelectionStart, this.onMouseSelection);
    addCanvasListener("mousemove", this.onSelectionMove, this.onMouseSelection);
    addCanvasListener("mouseup", this.onSelectionEnd);
    document.addEventListener("mouseup", this.onSelectionEnd, false);

    addCanvasListener("touchstart", this.onSelectionStart, this.onTouchSelection);
    addCanvasListener("touchmove", this.onSelectionMove, this.onTouchSelection);
    addCanvasListener("touchend", this.onSelectionEnd);
    document.addEventListener("touchend", this.onSelectionEnd, false);
  }

  private onMouseSelection = (method: (x: number, y: number) => void, e: MouseEvent): void => {
    method(e.offsetX, e.offsetY);
  };

  private onTouchSelection = (method: (x: number, y: number) => void, e: TouchEvent): void => {
    e.preventDefault();
    const offsetTop = this.wrapperElement.offsetTop;
    const offsetLeft = this.wrapperElement.offsetLeft;
    method(Math.floor(e.touches[0].clientX - offsetLeft), Math.floor(e.touches[0].clientY - offsetTop));
  };

  private onSelectionStart = (x: number, y: number): void => {
    if (!this.cancelEvents) {
      this.isSelecting = true;
      this.processSelectionStart(x, y);
    }
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.isSelecting) this.processSelectionMove(x, y);
  };

  private onSelectionEnd = (): void => {
    if (this.isSelecting) {
      this.isSelecting = false;
      this.processSelectionEnd();
    }
  };
}

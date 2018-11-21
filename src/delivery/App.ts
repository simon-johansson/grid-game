import { IGameLevel, IGameRules, IGridLayout } from "../domain/boundaries/input";
import { IGameState } from "../domain/boundaries/output";
import GameState from "../domain/entities/GameState";
import GameInteractor from "../domain/GameInteractor";
import CanvasProvider from "./components/CanvasProvider";
import LevelSelector from "./components/LevelSelector";
import MovesCounter from "./components/MovesCounter";
import { gameBoardLayouts } from "./data/levels";
import {
  SelectionPresenter,
  TileBlockerPresenter,
  TileFlippablePresenter,
  TileMultiFlipPresenter
} from "./game_presenters/index";
import { getQueryStringParams } from "./utils";

class App {
  private gameInteractor = new GameInteractor(
    SelectionPresenter,
    TileFlippablePresenter,
    TileBlockerPresenter,
    TileMultiFlipPresenter
  );
  private isSelecting: boolean = false;
  private queryStringRules: IGameRules = {};
  private queryStringLayout: IGridLayout;
  private currentLevel: number = 0;

  // Components
  private GameCanvasComponent: CanvasProvider;
  private LevelSelectorComponent: LevelSelector;
  private MovesCounterComponent: MovesCounter;

  public init = (): void => {
    this.createComponents();
    this.bindEvents();
    this.analyseQueryString();

    // TODO: Lägg in render i createGame
    const initState = this.createGame();
    this.render(initState);
  };

  private createComponents() {
    this.GameCanvasComponent = CanvasProvider.Instance;
    this.MovesCounterComponent = new MovesCounter();
    this.LevelSelectorComponent = new LevelSelector(
      this.goToPrevLevel.bind(this),
      this.goToNextLevel.bind(this),
      this.restartLevel.bind(this)
    );
  }

  // TODO: FLytta till CanvasProvidor
  private bindEvents = (): void => {
    const addCanvasListener = (eventType: string, onEventActionFn: any, proxyFn?: any) =>
      this.GameCanvasComponent.SELECTION_CANVAS.addEventListener(
        eventType,
        proxyFn ? proxyFn.bind(this, onEventActionFn) : onEventActionFn,
        false
      );

    addCanvasListener("mousedown", this.onSelectionStart, this.onMouseSelection);
    addCanvasListener("mousemove", this.onSelectionMove, this.onMouseSelection);
    addCanvasListener("mouseup", this.onSelectionEnd);
    document.addEventListener("mouseup", this.onSelectionEnd, false);

    addCanvasListener("touchstart", this.onSelectionStart, this.onTouchSelection);
    addCanvasListener("touchmove", this.onSelectionMove, this.onTouchSelection);
    addCanvasListener("touchend", this.onSelectionEnd);
    document.addEventListener("touchend", this.onSelectionEnd, false);
  };

  private analyseQueryString = (): void => {
    const queryStringParams = getQueryStringParams(window.location.search);
    const getParam = <T>(param: string): T => {
      try {
        return JSON.parse(queryStringParams[param]) as T;
      } catch (error) {}
    };

    this.queryStringLayout = getParam<IGridLayout>("layout");
    this.currentLevel = getParam<number>("level") || 0;
    this.queryStringRules.toggleOnOverlap = getParam<boolean>("toggleOnOverlap");
    this.queryStringRules.minSelection = getParam<number>("minSelection");
  };

  private createGame = (): GameState => {
    const level = this.getLayout();
    level.rules = this.getRules(level.rules);
    return this.gameInteractor.startLevel(level);
  };

  private getLayout = (): IGameLevel => {
    const layout = this.queryStringLayout;
    return layout ? { layout } : gameBoardLayouts[this.currentLevel];
  };

  private getRules = (rules: IGameRules): IGameRules => {
    rules = rules || {};
    return Object.assign(rules, this.queryStringRules);
  };

  // TODO: FLytta till CanvasProvidor
  private onMouseSelection = (method: (x: number, y: number) => void, e: MouseEvent): void => {
    method(e.offsetX, e.offsetY);
  };

  // TODO: FLytta till CanvasProvidor
  private onTouchSelection = (method: (x: number, y: number) => void, e: TouchEvent): void => {
    e.preventDefault();
    const offsetLeft = this.GameCanvasComponent.offsetLeft;
    const offsetTop = this.GameCanvasComponent.offsetTop;
    method(Math.floor(e.touches[0].clientX - offsetLeft), Math.floor(e.touches[0].clientY - offsetTop));
  };

  private onSelectionStart = (x: number, y: number): void => {
    this.isSelecting = true;
    this.gameInteractor.setSelectionStart(
      this.convertAbsoluteOffsetToProcent(x),
      this.convertAbsoluteOffsetToProcent(y)
    );
  };

  private onSelectionMove = (x: number, y: number): void => {
    if (this.isSelecting) {
      this.gameInteractor.setSelectionEnd(
        this.convertAbsoluteOffsetToProcent(x),
        this.convertAbsoluteOffsetToProcent(y)
      );
    }
  };

  private onSelectionEnd = (): void => {
    if (this.isSelecting) {
      this.isSelecting = false;
      const gameState = this.gameInteractor.evaluateSelection();
      this.render(gameState);

      // console.log(this.shouldProcedeToNextLevel(gameState));

      if (this.shouldProcedeToNextLevel(gameState)) {
        this.goToNextLevel();
        // setTimeout(() => {
        //   this.goToNextLevel();
        // }, 500);
        return;
      }

      if (gameState.selectionsLeft === 0) {
        const newState = this.createGame();
        this.render(newState);
        // setTimeout(() => {
        //   location.reload();
        // }, 500);
        return;
      }
    }
  };

  private render(gameState: IGameState): void {
    this.GameCanvasComponent.render({});

    this.MovesCounterComponent.render({
      selectionsLeft: gameState.selectionsLeft,
      selectionsMade: gameState.selectionsMade.valid,
      isLevelCleared: gameState.cleared
    });

    this.LevelSelectorComponent.render({
      currentLevel: this.currentLevel,
      isLastLevel: this.currentLevel >= gameBoardLayouts.length - 1
    });
  }

  private goToPrevLevel() {
    this.currentLevel -= 1;
    this.GameCanvasComponent.prepareNewLevel('prev');
    const newState = this.createGame();
    this.GameCanvasComponent.showNewLevel('prev');
    this.bindEvents();
    this.render(newState);
  };

  private goToNextLevel() {
    this.currentLevel += 1;
    this.GameCanvasComponent.prepareNewLevel('next');
    const newState = this.createGame();
    this.GameCanvasComponent.showNewLevel('next');
    this.bindEvents();
    this.render(newState);
  }

  private restartLevel = (): void => location.reload();

  private convertAbsoluteOffsetToProcent = (position: number) =>
    Math.floor((position / CanvasProvider.Instance.canvasSize) * 100);

  private shouldProcedeToNextLevel = (state: GameState) =>
    state.cleared && this.currentLevel <= gameBoardLayouts.length - 1 && !this.queryStringLayout;
}

const app = new App();
app.init();

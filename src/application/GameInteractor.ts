import Level from "../domain/Level";
import { InteractorUtils } from "./InteractorUtils";
import {
  IGameLevel,
  IGridLayout,
  ILevelData,
  INetworkGateway,
  ISelectionPresenterConstructor,
  ITilePresenterConstructor,
  TileType,
} from "./interfaces";
import LevelManager from "./LevelManager";

export interface IPresenters {
  selection: ISelectionPresenterConstructor;
  tile: ITilePresenterConstructor;
}

/**
 * Class containing the use cases for the application
 */
export default class GameInteractor extends InteractorUtils {
  private levelManager: LevelManager;
  private level: Level;

  constructor(network: INetworkGateway) {
    super(network);
    // TODO: Load progress from localStorage
  }

  public async loadLevels() {
    try {
      const levels = await this.network.getLevels();
      this.levelManager = new LevelManager(levels, 0);
    } catch (error) {
      console.error(error);
    }
  }

  public startCurrentLevel(presenters: IPresenters): ILevelData {
    this.level = this.levelManager.getCurrentLevel;
    this.startLevel(presenters, this.level);
    return this.level;
  }

  public startNextLevel(presenters: IPresenters): ILevelData {
    this.level = this.levelManager.getNextLevel;
    this.startLevel(presenters, this.level);
    return this.level;
  }

  public startPrevLevel(presenters: IPresenters): ILevelData {
    this.level = this.levelManager.getPreviousLevel;
    this.startLevel(presenters, this.level);
    return this.level;
  }

  public startCustomLevel(presenters: IPresenters, level: IGameLevel): ILevelData {
    this.level = LevelManager.newLevel(level);
    this.startLevel(presenters, this.level);
    return this.level;
  }

  public setSelectionStart(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setStartPoint(gridOffsetX, gridOffsetY);
    this.applySelectionToGrid(tileState);
  }

  public setSelectionEnd(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setEndPoint(gridOffsetX, gridOffsetY);
    this.applySelectionToGrid(tileState);
  }

  public processSelection(): ILevelData {
    if (this.grid.isSelectionValid) {
      this.grid.clearSelectedTiles();
      this.level.onValidSelection();
      this.level.isCleared = this.grid.isGridCleared;
    }
    this.removeSelection();
    return this.level;
  }

  public removeSelection(): void {
    this.grid.deselectTiles();
    this.selection.clear();
  }

  public getGridLayout(): IGridLayout {
    return LevelManager.getMinifiedLayout(this.grid.tiles);
  }
}

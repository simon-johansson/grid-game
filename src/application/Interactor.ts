import Grid from "@domain/Grid";
import Level, { ITypedGridLayout } from "@domain/Level";
import Rules, { IGameRules } from "@domain/Rules";
import Selection from "@domain/Selection";
import Tile from "@domain/Tile";
import TilePosition from "@domain/TilePosition";
import {
  IAnalytics,
  IGameLevel,
  IGridLayout,
  IInstaller,
  ILevelData,
  INetworkGateway,
  IOverviewData,
  IQueryString,
  ISelectionPresenterConstructor,
  ISettableUserInformation,
  IStorage,
  ITilePresenterConstructor,
  IUserInformation,
  TileType,
} from "./interfaces";
import LevelManager from "./LevelManager";

export interface IPresenters {
  selection: ISelectionPresenterConstructor;
  tile: ITilePresenterConstructor;
}

const createTiles = (presenter: ITilePresenterConstructor, layout: ITypedGridLayout, rules: Rules): Tile[] => {
  const tiles: Tile[] = [];
  layout.forEach((row, rowIndex) => {
    row.forEach((tileState, colIndex) => {
      tiles.push(new Tile(tileState, new TilePosition(rowIndex, colIndex), rules, new presenter()));
    });
  });
  return tiles;
};

/**
 * Class containing the use cases for the application
 */
export default class Interactor {
  private levelManager: LevelManager;
  private level: Level;
  private grid: Grid;
  private selection: Selection;

  constructor(
    private network: INetworkGateway,
    private analytics: IAnalytics,
    private storage: IStorage,
    private querystring: IQueryString,
    public installer: IInstaller,
  ) {}

  public async loadLevels(): Promise<void> {
    if (this.levelManager !== undefined) return Promise.resolve();
    try {
      const levels = await this.network.getLevels();
      const currentLevel = await this.getCurrentLevelID();
      const completedLevels = await this.getCompletedLevels();
      this.levelManager = new LevelManager(levels, currentLevel, completedLevels);
    } catch (error) {
      console.error(error);
      this.analytics.onError(error);
    }
  }

  public startCurrentLevel(presenters: IPresenters): ILevelData {
    const querystringLevel = this.querystring.getLevel();
    this.level = this.levelManager.getCurrentLevel(querystringLevel);
    this.startLevel(presenters);
    return this.level;
  }

  public startSpecificLevel(presenters: IPresenters, levelID: string): ILevelData {
    this.level = this.levelManager.getCurrentLevel(levelID);
    this.startLevel(presenters);
    return this.level;
  }

  public startNextLevel(presenters: IPresenters): ILevelData {
    this.level = this.levelManager.nextLevel;
    this.startLevel(presenters);
    return this.level;
  }

  public startPrevLevel(presenters: IPresenters): ILevelData {
    this.level = this.levelManager.previousLevel;
    this.startLevel(presenters);
    return this.level;
  }

  // TODO: Ta bort? används bara för tester
  public startCustomLevel(presenters: IPresenters, level: IGameLevel): ILevelData {
    this.level = LevelManager.newLevel(level);
    this.startLevel(presenters);
    return this.level;
  }

  public startEditorLevel(presenters: IPresenters): ILevelData {
    const querystringLevel = this.querystring.getLevel();
    this.level = LevelManager.newEditorLevel(querystringLevel);
    this.startLevel(presenters);
    this.setQuerystringLevel();
    return this.level;
  }

  public getOverviewData(): IOverviewData {
    return this.levelManager.overview;
  }

  public getUserData(): Promise<IUserInformation> {
    return this.storage.getUserInformation();
  }

  public setUserData(userInfo: Partial<ISettableUserInformation>, persisted?: boolean): void {
    return this.storage.setUserInformation(userInfo, persisted);
  }

  public setSelectionStart(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setStartPoint({ x: gridOffsetX, y: gridOffsetY });
    this.applySelectionToGrid(tileState);
  }

  public setSelectionEnd(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setEndPoint({ x: gridOffsetX, y: gridOffsetY });
    this.applySelectionToGrid(tileState);
  }

  public processSelection(): ILevelData {
    if (this.grid.isSelectedTilesClearable) this.clearTiles();
    if (this.hasLevelEnded) this.onLevelEnded();
    this.removeSelection();
    return this.level;
  }

  public cheatToClearLevel(): ILevelData {
    this.level.isCleared = true;
    this.onLevelEnded();
    return this.level;
  }

  public removeSelection(): void {
    this.grid.deselectTiles();
    this.selection.remove();
  }

  public getGridLayout(): IGridLayout {
    return LevelManager.getMinifiedLayout(this.grid.tiles);
  }

  public setCustomRules(rules: IGameRules): void {
    this.querystring.setRules(rules);
  }

  public setCustomMoves(moves: number): void {
    this.querystring.setMoves(moves);
  }

  public get isInEditMode(): boolean {
    return !!this.querystring.getIsEditMode();
  }

  public goToEditMode(): void {
    this.querystring.setIsEditMode(true);
    window.location.reload();
  }

  public goToPlayMode(): void {
    this.querystring.setIsEditMode(false);
    window.location.reload();
  }

  private startLevel(presenters: IPresenters): void {
    this.createEnteties(presenters);
    this.persistCurrentLevel();
    this.analytics.startLevel(this.level);
  }

  private createEnteties(presenters: IPresenters): void {
    const { grid, rules } = this.level;
    const tiles = createTiles(presenters.tile, grid.layout, rules);
    this.grid = new Grid(tiles, rules);
    this.selection = new Selection(grid.numberOfRows, grid.numberOfCols, new presenters.selection());
  }

  private applySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.tileSpan!, tileState);
    tileState ? this.onAppliedEditSelection() : this.onAppliedPlaySelection();
  }

  private onAppliedEditSelection(): void {
    this.setCustomLayout();
  }

  private onAppliedPlaySelection(): void {
    this.selection.isValid = this.grid.isSelectedTilesClearable;
  }

  private setQuerystringLevel(): void {
    this.setCustomRules(this.level.rules);
    this.setCustomMoves(this.level.selections.left);
    this.setCustomLayout();
  }

  private setCustomLayout(): void {
    this.querystring.setLayout(this.getGridLayout());
  }

  private clearTiles(): void {
    this.grid.toggleClearedOnSelectedTiles();
    this.level.onValidSelection(this.selection.tileSpan!);
    this.level.isCleared = this.grid.isGridCleared;
  }

  private async onLevelEnded(): Promise<void> {
    if (this.level.isCleared) {
      this.analytics.onLevelComplete(this.level);
      const completedLevels = await this.storage.onLevelComplete(this.level.id!);
      this.network.setCompletedLevels(completedLevels);
      this.levelManager.onLevelComplete(completedLevels);
    } else {
      this.analytics.onLevelFailed(this.level);
    }
  }

  private get hasLevelEnded(): boolean {
    return (!this.level.selections.left || this.level.isCleared) && this.level.id !== undefined;
  }

  private async getCurrentLevelID(): Promise<string | null> {
    const locallyStoredLevel = await this.storage.getCurrentLevel();
    try {
      const cachedLevel = await this.network.getCurrentLevel();
      if (cachedLevel) this.storage.setCurrentLevel(cachedLevel);
      return cachedLevel;
    } catch (error) {
      console.log("Failed to load current levels from service worker cache: ", error);
    }
    return locallyStoredLevel;
  }

  private async getCompletedLevels(): Promise<string[] | null> {
    const locallyStoredLevels = await this.storage.getCompletedLevels();
    try {
      const cachedLevels = await this.network.getCompletedLevels();
      if (!locallyStoredLevels || cachedLevels.length > locallyStoredLevels.length) {
        this.storage.setCompletedLevels(cachedLevels);
        return cachedLevels;
      }
    } catch (error) {
      console.log("Failed to load completed levels from service worker cache: ", error);
    }
    return locallyStoredLevels;
  }

  private persistCurrentLevel(): void {
    if (this.level.id !== undefined) {
      this.storage.setCurrentLevel(this.level.id);
      this.network.setCurrentLevel(this.level.id);
    }
  }
}

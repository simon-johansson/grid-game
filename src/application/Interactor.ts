import Grid from "../domain/Grid";
import Level, { ITypedGridLayout } from "../domain/Level";
import Rules from "../domain/Rules";
import Selection from "../domain/Selection";
import Tile from "../domain/Tile";
import TilePosition from "../domain/TilePosition";
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

  constructor(private network: INetworkGateway) {}

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
    this.selection.setStartPoint({ x: gridOffsetX, y: gridOffsetY });
    this.applySelectionToGrid(tileState);
  }

  public setSelectionEnd(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setEndPoint({ x: gridOffsetX, y: gridOffsetY });
    this.applySelectionToGrid(tileState);
  }

  public processSelection(): ILevelData {
    if (this.grid.isSelectedTilesClearable) {
      this.grid.toggleClearedOnSelectedTiles();
      this.level.onValidSelection();
      this.level.isCleared = this.grid.isGridCleared;
    }
    this.removeSelection();
    return this.level;
  }

  public removeSelection(): void {
    this.grid.deselectTiles();
    this.selection.remove();
  }

  public getGridLayout(): IGridLayout {
    return LevelManager.getMinifiedLayout(this.grid.tiles);
  }

  private startLevel(presenters: IPresenters, { grid, rules }: Level): void {
    const tiles = createTiles(presenters.tile, grid.layout, rules);
    this.grid = new Grid(tiles, rules);
    this.selection = new Selection(grid.numberOfRows, grid.numberOfCols, new presenters.selection());
  }

  private applySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.tileSpan, tileState);
    if (!tileState) this.selection.isValid = this.grid.isSelectedTilesClearable;
  }
}

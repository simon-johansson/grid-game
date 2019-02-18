import Grid from "../domain/Grid";
import GridPoint from "../domain/GridPoint";
import Level from "../domain/Level";
import Selection from "../domain/Selection";
import Tile from "../domain/Tile";
import {
  IGameLevel,
  IGameRules,
  ISelectionPresenterConstructor,
  ITilePresenterConstructor,
  TileType,
} from "./boundaries/input";
import INetworkGateway from "./INetworkGateway";

export interface IPresenters {
  selection: ISelectionPresenterConstructor;
  tile: ITilePresenterConstructor,
}

export default class GameInteractor {
  private level: Level;
  private grid: Grid;
  private selection: Selection;
  private currentLevelIndex: number = 0;
  private levels: IGameLevel[];

  constructor(private network: INetworkGateway) {
    // TODO: Load progress from localStorage

    // TODO: Gör snyggare
    (window as any).exportLevel = () => console.log(JSON.stringify(this.level.minified));
  }

  // TODO: Cache i service-worker.js så att det funkar offline
  public async loadLevels() {
    try {
      this.levels = await this.network.getLevels();
    } catch (error) {
      console.error(error);
    }
  }

  public startCurrentLevel(presenters: IPresenters): Level {
    return this.startLevel(presenters);
  }

  public startNextLevel(presenters: IPresenters): Level {
    ++this.currentLevelIndex;
    return this.startLevel(presenters);
  }

  public startPrevLevel(presenters: IPresenters): Level {
    --this.currentLevelIndex;
    return this.startLevel(presenters);
  }

  public startCustomLevel(presenters: IPresenters, level: IGameLevel): Level {
    return this.startLevel(presenters, level);
  }

  // TODO: Fult att skicka in tileState här...
  public setSelectionStart(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setStartPoint(gridOffsetX, gridOffsetY);
    this.supplySelectionToGrid(tileState);
  }

  // TODO: Fult att skicka in tileState här...
  public setSelectionEnd(gridOffsetX: number, gridOffsetY: number, tileState?: TileType): void {
    this.selection.setEndPoint(gridOffsetX, gridOffsetY);
    this.supplySelectionToGrid(tileState);
  }

  // TODO: Fult att skicka in edit flagga här...
  public evaluateSelection(isEditingGrid: boolean = false): Level {
    this.level.onSelectionMade(this.grid.evaluateSelection(isEditingGrid));
    this.selection.clear();
    return this.level;
  }

  // TODO: Inte snyggt, borde skötas via en customLevel metod
  public setLevelRules(rules: IGameRules): Level {
    this.level.minified.rules = rules;
    return this.level;
  }

  // TODO: Inte snyggt, borde skötas via en customLevel metod
  public setLevelMoves(moves: number): Level {
    this.level.minified.moves = moves;
    return this.level;
  }

  private startLevel(presenters: IPresenters, level?: IGameLevel): Level {
    const index = this.currentLevelIndex;
    this.level = new Level(level || this.levels[index], index);
    this.createGrid(presenters.tile);
    this.createSelection(presenters.selection);
    return this.level;
  }

  private createGrid(presenter: ITilePresenterConstructor): void {
    const tiles = this.createTiles(presenter);
    this.grid = new Grid(tiles, this.level.rules);
  }

  private createSelection(presenter: ISelectionPresenterConstructor): void {
    this.selection = new Selection(
      this.level.grid.numberOfRows,
      this.level.grid.numberOfCols,
      new presenter(),
    );
  }

  private createTiles(presenter: ITilePresenterConstructor): Tile[] {
    const tiles: Tile[] = [];
    this.level.grid.layout.forEach((row, rowIndex) => {
      row.forEach((tileState, colIndex) => {
        tiles.push(new Tile(tileState, new GridPoint(rowIndex, colIndex), this.level.rules, new presenter()));
      });
    });
    return tiles;
  }

  private supplySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.gridSpan, tileState);
    // If in edit mode = always true
    this.selection.isValid = tileState ? true : this.grid.isSelectionValid;
  }
}

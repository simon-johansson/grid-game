import { IGameLevel, IGameRules, ISelectionPresenterConstructor, ITilePresenterConstructor, TileType } from "./boundaries/input";
import Grid from "./entities/Grid";
import GridPoint from "./entities/GridPoint";
import Level from "./entities/Level";
import Selection from "./entities/Selection";
import Tile from "./entities/Tile";
import INetworkGateway from "./INetworkGateway";

export default class GameInteractor {
  private level: Level;
  private grid: Grid;
  private selection: Selection;
  private currentLevelIndex: number = 0;
  private levels: IGameLevel[];

  constructor(
    private selectionPresenter: ISelectionPresenterConstructor,
    private tilePresenter: ITilePresenterConstructor,
    private network: INetworkGateway
  ) {
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

  public startCurrentLevel(): Level {
    return this.startLevel();
  }

  public startNextLevel(): Level {
    ++this.currentLevelIndex;
    return this.startLevel();
  }

  public startPrevLevel(): Level {
    --this.currentLevelIndex;
    return this.startLevel();
  }

  public startCustomLevel(level: IGameLevel): Level {
    return this.startLevel(level);
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

  private startLevel(level?: IGameLevel): Level {
    const index = this.currentLevelIndex;
    this.level = new Level(level || this.levels[index], index);
    this.createGrid();
    this.createSelection();
    return this.level;
  }

  private createGrid(): void {
    this.grid = new Grid(this.createTiles(), this.level.rules);
  }

  private createSelection(): void {
    this.selection = new Selection(
      this.level.grid.numberOfRows,
      this.level.grid.numberOfCols,
      new this.selectionPresenter()
    );
  }

  private supplySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.gridSpan, tileState);
    // If in edit mode = always true
    this.selection.isValid = tileState ? true : this.grid.isSelectionValid;
  }

  private createTiles(): Tile[] {
    const tiles: Tile[] = [];
    this.level.grid.layout.forEach((row, rowIndex) => {
      row.forEach((tileState, colIndex) => {
        tiles.push(new Tile(tileState, new GridPoint(rowIndex, colIndex), this.level.rules, new this.tilePresenter()));
      });
    });
    return tiles;
  }
}

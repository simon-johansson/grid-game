import {
  IGameLevel,
  IGameRules,
  ISelectionPresenterConstructor,
  ITilePresenterConstructor,
  TileType,
} from "./boundaries/input";
import GameState from "./entities/GameState";
import Grid from "./entities/Grid";
import Selection from "./entities/Selection";
import TileFactory from "./TileFactory";

export default class GameInteractor {
  private grid: Grid;
  private selection: Selection;
  private state: GameState;
  // private

  constructor(
    private selectionPresenter: ISelectionPresenterConstructor,
    private tilePresenter: ITilePresenterConstructor
  ) {
    // TODO: Load levels from DB
    // TODO: Load progress from localStorage
  }

  public startLevel(gameLevel: IGameLevel): GameState {
    this.state = new GameState(gameLevel);
    this.createGrid();
    this.createSelection();
    return this.state;
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

  public evaluateSelection(isEditingGrid: boolean = false): GameState {
    this.state.onSelectionMade(this.grid.evaluateSelection(isEditingGrid));
    this.selection.clear();
    return this.state;
  }

  public setLevelRules(rules: IGameRules): GameState {
    this.state.setLevelRules(rules);
    return this.state;
  }

  public setLevelMoves(moves: number): GameState {
    this.state.setLevelMoves(moves);
    return this.state;
  }

  private createGrid(): void {
    const tileFactory = new TileFactory(this.state.rules, this.tilePresenter);
    const tiles = tileFactory.parseRawTiles(this.state.grid.layout);
    this.grid = new Grid(tiles, this.state.rules);
  }

  private createSelection(): void {
    this.selection = new Selection(
      this.state.grid.numberOfRows,
      this.state.grid.numberOfCols,
      new this.selectionPresenter()
    );
  }

  private supplySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.gridSpan, tileState);

    // If in edit mode = always true
    this.selection.isValid = tileState ? true : this.grid.isSelectionValid;
  }
}

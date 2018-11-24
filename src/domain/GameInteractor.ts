import { IGameLevel, ISelectionPresenterConstructor, ITilePresenterConstructor } from "./boundaries/input";
import GameState from "./entities/GameState";
import Grid from "./entities/Grid";
import Selection from "./entities/Selection";
import TileFactory from "./TileFactory";

export default class GameInteractor {
  private currentGrid: Grid;
  private selection: Selection;
  private state: GameState;

  constructor(
    private selectionPresenter: ISelectionPresenterConstructor,
    private tileFlippablePresenter: ITilePresenterConstructor,
    private tileBlockerPresenter: ITilePresenterConstructor,
    private tileMultiFlipPresenter: ITilePresenterConstructor
  ) {}

  public startLevel(gameLevel: IGameLevel): GameState {
    this.state = new GameState(gameLevel);
    this.createGrid();
    this.createSelection();
    return this.state;
  }

  public setSelectionStart(gridOffsetX: number, gridOffsetY: number): void {
    this.selection.setStartPoint(gridOffsetX, gridOffsetY);
    this.supplySelectionToGrid();
  }

  public setSelectionEnd(gridOffsetX: number, gridOffsetY: number): void {
    this.selection.setEndPoint(gridOffsetX, gridOffsetY);
    this.supplySelectionToGrid();
  }

  public evaluateSelection(): GameState {
    this.state.onSelectionMade(this.currentGrid.evaluateSelection());
    this.selection.clear();
    return this.state;
  }

  private createGrid(): void {
    const tileFactory = new TileFactory(
      this.state.rules,
      this.tileFlippablePresenter,
      this.tileBlockerPresenter,
      this.tileMultiFlipPresenter
    );
    const tiles = tileFactory.parseRawTiles(this.state.grid.layout);
    this.currentGrid = new Grid(tiles, this.state.rules);
  }

  private createSelection(): void {
    this.selection = new Selection(
      this.state.grid.numberOfRows,
      this.state.grid.numberOfCols,
      new this.selectionPresenter()
    );
  }

  private supplySelectionToGrid(): void {
    this.currentGrid.setSelection(this.selection.gridSpan);
    this.selection.isValid = !this.currentGrid.selectionIsInvalid;
  }
}

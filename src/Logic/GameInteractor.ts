import { IGameLevel, IGameRules, ISelectionPresenterConstructor, ITilePresenterConstructor } from "./boundaries";
import GameState from "./GameState";
import Grid from "./Grid";
// import GridPoint from "./GridPoint";
import Selection from "./Selection";
import TileFactory from "./TileFactory";

export default class GameInteractor {
  private currentGrid: Grid;
  private selection: Selection;
  private state: GameState;

  constructor(
    private gridSize: number,
    private selectionPresenter: ISelectionPresenterConstructor,
    private tileFlippablePresenter: ITilePresenterConstructor,
    private tileBlockerPresenter: ITilePresenterConstructor,
    private tileMultiFlipPresenter: ITilePresenterConstructor
  ) {}

  public startLevel(gameLevel: IGameLevel): void {
    this.state = new GameState(gameLevel);
    this.createGrid();
    this.createSelection();
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
      this.state.rules,
      this.state.grid.numberOfRows,
      this.state.grid.numberOfCols,
      this.gridSize,
      new this.selectionPresenter()
    );
  }

  private supplySelectionToGrid(): void {
    this.currentGrid.setSelection(this.selection.gridSpan);
  }
}

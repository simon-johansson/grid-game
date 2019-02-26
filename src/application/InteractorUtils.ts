import Grid from "../domain/Grid";
import GridPoint from "../domain/GridPoint";
import Level from "../domain/Level";
import Selection from "../domain/Selection";
import Tile from "../domain/Tile";
import { IPresenters } from "./GameInteractor";
import {
  IGameLevel,
  IGameRules,
  INetworkGateway,
  ISelectionPresenterConstructor,
  ITilePresenterConstructor,
  ITypedGridLayout,
  TileType,
} from "./interfaces";

(window as any).exportLevel = (level: IGameLevel) => console.log(JSON.stringify(level));

export abstract class InteractorUtils {
  protected grid: Grid;
  protected selection: Selection;

  constructor(protected network: INetworkGateway) {
    // TODO: Load progress from localStorage
  }

  protected startLevel(presenters: IPresenters, level: Level): void {
    const tiles = this.createTiles(presenters.tile, level.grid.layout, level.rules);
    this.grid = this.createGrid(tiles, level.rules);
    this.selection = this.createSelection(presenters.selection, level.grid.numberOfRows, level.grid.numberOfCols);
  }

  protected createGrid(tiles: Tile[], rules: IGameRules): Grid {
    return new Grid(tiles, rules);
  }

  protected createSelection(presenter: ISelectionPresenterConstructor, rows: number, cols: number): Selection {
    return new Selection(rows, cols, new presenter());
  }

  protected createTiles(presenter: ITilePresenterConstructor, layout: ITypedGridLayout, rules: IGameRules): Tile[] {
    const tiles: Tile[] = [];
    layout.forEach((row, rowIndex) => {
      row.forEach((tileState, colIndex) => {
        tiles.push(new Tile(tileState, new GridPoint(rowIndex, colIndex), rules, new presenter()));
      });
    });
    return tiles;
  }

  protected applySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.gridSpan, tileState);
    if (!tileState) this.selection.isValid = this.grid.isSelectionValid;
  }
}

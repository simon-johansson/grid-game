import Grid from "../domain/Grid";
import Level from "../domain/Level";
import Rules from "../domain/Rules";
import Selection from "../domain/Selection";
import Tile from "../domain/Tile";
import TilePosition from "../domain/TilePosition";
import { IPresenters } from "./GameInteractor";
import {
  IGameLevel,
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

  protected createGrid(tiles: Tile[], rules: Rules): Grid {
    return new Grid(tiles, rules);
  }

  protected createSelection(presenter: ISelectionPresenterConstructor, rows: number, cols: number): Selection {
    return new Selection(rows, cols, new presenter());
  }

  protected createTiles(presenter: ITilePresenterConstructor, layout: ITypedGridLayout, rules: Rules): Tile[] {
    const tiles: Tile[] = [];
    layout.forEach((row, rowIndex) => {
      row.forEach((tileState, colIndex) => {
        tiles.push(new Tile(tileState, new TilePosition(rowIndex, colIndex), rules, new presenter()));
      });
    });
    return tiles;
  }

  protected applySelectionToGrid(tileState?: TileType): void {
    this.grid.applySelection(this.selection.tileSpan, tileState);
    if (!tileState) this.selection.isValid = this.grid.isSelectedTilesClearable;
  }
}

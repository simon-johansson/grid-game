import Rules from "./Rules";
import Tile, { TileType } from "./Tile";
import TileSpan from "./TileSpan";

export interface ITileGroupPresentationData {
  isSelected: boolean;
  isCleared: boolean;
  position: TileSpan;
}

export interface ITileGroupPresenter {
  render: (tileGroup: ITileGroupPresentationData) => void;
}

export default class TileGroup {
  private selected: boolean = false;
  private tiles: Tile[] = [];

  constructor(public position: TileSpan, private presenter: ITileGroupPresenter) {
    this.render();
  }

  public addTile(tile: Tile): void {
    this.tiles.push(tile);
    this.render();
  }

  public get isSelected(): boolean {
    return this.selected;
  }
  public get isCleared(): boolean {
    // TODO: Duplication. Samma sak i Grid
    const tilesLeftToClear = (tile: Tile) => tile.isClearable && !tile.isCleared;
    return !this.tiles.some(tilesLeftToClear);
  }

  public toggleCleared(): void {
    this.tiles.forEach(tile => tile.toggleCleared());
    this.render();
  }

  public deselect(): void {
    this.setSelected(false);
  }

  public applySelection(selection: TileSpan, tileType?: TileType): void {
    const isSelected = this.tiles.some(tile => tile.isCoveredBySelection(selection));
    if (isSelected && tileType) this.setTileType(tileType);
    else this.setSelected(isSelected);
  }

  private setSelected(selected: boolean): void {
    if (this.selected !== selected) {
      this.selected = selected;
      this.tiles.forEach(tile => tile.setSelected(selected));
      this.render();
    }
  }

  private setTileType(tileType: TileType): void {
    this.tiles.forEach(tile => tile.setTileType(tileType));
  }

  private render(): void {
    this.presenter.render(this);
  }
}

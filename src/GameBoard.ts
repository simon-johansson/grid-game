import Selection from "./Selection";
import Tile from "./Tile";

export type IGameBoardLayout = Array<Array<"r" | "f" | "b">>;

interface ISettings {
  toggleOnOverlap: boolean;
}

export default class GameBoard {
  private tiles: Tile[] = [];

  constructor(
    private boardLayout: IGameBoardLayout,
    private rows: number,
    private columns: number,
    private width: number,
    private height: number,
    private settings: ISettings
  ) {
    this.createElements();
  }

  public draw(ctx: CanvasRenderingContext2D): void {
    this.tiles.forEach(el => {
      el.draw(ctx);
      // el.drawAdditionalDetails(ctx);
    });
  }

  public evaluateSelection(selection: Selection): any {
    // console.log(selection);
    const tilesToToggleFlip: Tile[] = [];
    const newLayout: any[] = [[], [], [], [], []];

    const invalidSelection = this.tiles.some(el => {
      if (el.isSelected) {
        if (el.isRemovable) {
          if (this.settings.toggleOnOverlap) {
            tilesToToggleFlip.push(el);
          } else if (!el.isDisabled) {
            tilesToToggleFlip.push(el);
          }
        }
        if (!el.isRemovable) {
          return true;
        }
      }
    });

    if (!invalidSelection) {
      tilesToToggleFlip.forEach(el => {
        el.isDisabled = !el.isDisabled;
        el.type = el.isDisabled ? "f" : "r";
      });
    }

    this.tiles.forEach(el => {
      const row = el.gridPosition[0];
      const col = el.gridPosition[1];
      newLayout[row][col] = el.type;
    });

    return {
      validMove: !invalidSelection,
      layout: newLayout
    };
  }

  public setSelection(selection: Selection): void {
    // this.tiles.forEach(el => el.setSelected(selection));
  }

  private createElements(): void {
    const elWidth = this.width / this.columns;
    const elHeight = this.height / this.rows;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const shape = {
          x: col * elWidth,
          y: row * elHeight,
          width: elWidth,
          height: elHeight
        };
        const type = this.boardLayout[row][col];
        this.tiles.push(new Tile(shape, type, [row, col]));
      }
    }
    // this.sortElements();
  }

  private sortElements() {
    this.tiles.sort((el1, el2) => el1.zIndex - el2.zIndex);
  }
}

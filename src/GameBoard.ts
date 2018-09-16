import GameBoardElement from "./GameBoardElement";
import Selection from "./Selection";

export type IGameBoardLayout = Array<Array<"⚪️" | "🔴">>;

interface ISettings {
  toggleOnOverlap: boolean;
}

export default class GameBoard {
  private elements: GameBoardElement[] = [];

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
    this.elements.forEach(el => {
      el.draw(ctx);
      el.drawAdditionalDetails(ctx);
    });
  }

  public evaluateSelection(selection: Selection): 1 | 0 {
    const elementsToToggleDisable: GameBoardElement[] = [];

    const invalidSelection = this.elements.some(el => {
      if (el.isSelected) {
        if (el.isRemovable) {
          if (this.settings.toggleOnOverlap) {
            elementsToToggleDisable.push(el);
          } else if (!el.isDisabled) {
            elementsToToggleDisable.push(el);
          }
        }
        if (!el.isRemovable) {
          return true;
        }
      }
    });

    if (!invalidSelection) {
      elementsToToggleDisable.forEach(el => (el.isDisabled = !el.isDisabled));
      return 1;
    } else {
      return 0;
    }
  }

  public setSelection(selection: Selection): void {
    this.elements.forEach(el => el.setSelected(selection));
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
        this.elements.push(new GameBoardElement(shape, type));
      }
    }
    this.sortElements();
  }

  private sortElements() {
    this.elements.sort((el1, el2) => el1.zIndex - el2.zIndex);
  }
}

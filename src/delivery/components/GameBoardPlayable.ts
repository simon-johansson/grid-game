import Interactor from "@application/Interactor";
import { IGameLevel, ILevelData } from "@application/interfaces";
import GameBoard from "./GameBoard";

export default class GameBoardPlayable extends GameBoard {
  constructor(interactor: Interactor, queryStringLevel: IGameLevel, onGameStateUpdate: (state: ILevelData) => void) {
    super(interactor, queryStringLevel, onGameStateUpdate);
  }

  protected HTML(props: {}): string {
    return `
      <div class="${this.innerWrapperClass}">
        <canvas class="${this.selectionCanvasClass}"></canvas>
        <canvas class="${this.tileCanvasClass}"></canvas>
      </div>
  `;
  }

  protected processSelectionStart(x: number, y: number): void {
    this.interactor.setSelectionStart(this.convertAbsoluteOffsetToProcent(x), this.convertAbsoluteOffsetToProcent(y));
  }

  protected processSelectionMove(x: number, y: number): void {
    this.interactor.setSelectionEnd(this.convertAbsoluteOffsetToProcent(x), this.convertAbsoluteOffsetToProcent(y));
  }

  protected processSelectionEnd(): void {
    const level = this.interactor.processSelection()
    this.interactor.removeSelection();
    this.onGameStateUpdate(level);
  }
}

import { IGameLevel } from "../../application/boundaries/input";
import { ILevel } from "../../application/boundaries/output";
import GameInteractor from "../../application/GameInteractor";
import GameBoard from "./GameBoard";

export default class GameBoardPlayable extends GameBoard {
  constructor(interactor: GameInteractor, queryStringLevel: IGameLevel, onGameStateUpdate: (state: ILevel) => void) {
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
    this.interactor.setSelectionStart(
      this.convertAbsoluteOffsetToProcent(x),
      this.convertAbsoluteOffsetToProcent(y)
    );
  }

  protected processSelectionMove(x: number, y: number): void {
    this.interactor.setSelectionEnd(
      this.convertAbsoluteOffsetToProcent(x),
      this.convertAbsoluteOffsetToProcent(y)
    );
  }

  protected processSelectionEnd(): void {
    this.onGameStateUpdate(this.interactor.evaluateSelection());
  }
}

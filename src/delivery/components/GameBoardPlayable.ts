import { IGameLevel } from "../../domain/boundaries/input";
import { IGameState } from "../../domain/boundaries/output";
import GameInteractor from "../../domain/GameInteractor";
import GameBoard from "./GameBoard";

export default class GameBoardPlayable extends GameBoard {
  constructor(level: IGameLevel, onGameStateUpdate: (state: IGameState) => void) {
    super(level, onGameStateUpdate);
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
    this.gameInteractor.setSelectionStart(
      this.convertAbsoluteOffsetToProcent(x),
      this.convertAbsoluteOffsetToProcent(y)
    );
  }

  protected processSelectionMove(x: number, y: number): void {
    this.gameInteractor.setSelectionEnd(
      this.convertAbsoluteOffsetToProcent(x),
      this.convertAbsoluteOffsetToProcent(y)
    );
  }

  protected processSelectionEnd(): void {
    this.onGameStateUpdate(this.gameInteractor.evaluateSelection());
  }
}

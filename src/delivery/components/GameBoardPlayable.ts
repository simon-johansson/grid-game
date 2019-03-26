import Interactor from "@application/Interactor";
import { IGameLevel, ILevelData } from "@application/interfaces";
import GameBoard from "./GameBoard";

export default class GameBoardPlayable extends GameBoard {
  constructor(interactor: Interactor, onGameStateUpdate: (state: ILevelData) => void) {
    super(interactor, onGameStateUpdate);
  }

  protected startLevel(): void {
    const state = this.interactor.startCurrentLevel(this.getPresenters());
    this.onGameStateUpdate(state);
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
    this.interactor.setSelectionStart(...this.getSelectionArguments(x, y));
  }

  protected processSelectionMove(x: number, y: number): void {
    this.interactor.setSelectionEnd(...this.getSelectionArguments(x, y));
  }

  protected processSelectionEnd(): void {
    const level = this.interactor.processSelection();
    this.interactor.removeSelection();
    this.onGameStateUpdate(level);
  }

  private getSelectionArguments = (x: number, y: number): [number, number] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
  ];
}

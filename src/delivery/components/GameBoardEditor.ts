import { IGameLevel, TileType } from "../../application/boundaries/input";
import { ILevel } from "../../application/boundaries/output";
import GameInteractor from "../../application/GameInteractor";
import EditorOptions, { ISelectedOptions } from "./EditorOptions";
import GameBoard from "./GameBoard";

export default class GameBoardEditor extends GameBoard {
  private EditorOptionsComponent: EditorOptions;
  private selectedOptions: ISelectedOptions;

  constructor(interactor: GameInteractor, queryStringLevel: IGameLevel, onGameStateUpdate: (state: ILevel) => void) {
    super(interactor, queryStringLevel, onGameStateUpdate);
    this.EditorOptionsComponent = new EditorOptions(this.onNewOptionsSet);
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
    // TODO: Borde använda en annan funktion än evaluateSelection här
    this.onGameStateUpdate(this.interactor.evaluateSelection(true));
  }

  private onNewOptionsSet = (options: ISelectedOptions) => {
    this.selectedOptions = options;
    this.interactor.setLevelMoves(this.selectedOptions.moves);
    this.onGameStateUpdate(this.interactor.setLevelRules(this.selectedOptions.rules));
  };

  private getSelectionArguments = (x: number, y: number): [number, number, TileType] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
    this.selectedOptions.tile
  ];
}

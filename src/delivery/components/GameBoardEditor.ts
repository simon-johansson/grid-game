import GameInteractor from "../../application/GameInteractor";
import { IGameLevel, ILevelData, TileType } from "../../application/interfaces";
import EditorOptions, { ISelectedOptions } from "./EditorOptions";
import GameBoard from "./GameBoard";

export default class GameBoardEditor extends GameBoard {
  private EditorOptionsComponent: EditorOptions;
  private selectedOptions: ISelectedOptions;

  constructor(
    interactor: GameInteractor,
    queryStringLevel: IGameLevel,
    onGameStateUpdate: (state: ILevelData) => void,
    private onEdit: (state: IGameLevel) => void,
  ) {
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
    console.log('processSelectionEnd');

    this.interactor.removeSelection();
    this.onEdit(this.getLevel);
  }

  private onNewOptionsSet = (options: ISelectedOptions) => {
    console.log('onNewOptionsSet');

    this.selectedOptions = options;
    this.onEdit(this.getLevel);
  };

  private get getLevel(): IGameLevel {
    console.log('getLevel');

    return {
      layout: this.interactor.getGridLayout(),
      moves: this.selectedOptions.moves,
      rules: this.selectedOptions.rules,
    };
  }

  private getSelectionArguments = (x: number, y: number): [number, number, TileType] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
    this.selectedOptions.tile,
  ];
}

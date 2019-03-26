import Interactor from "@application/Interactor";
import { IGameLevel, ILevelData, TileType } from "@application/interfaces";
import EditorOptions from "./EditorOptions";
import GameBoard from "./GameBoard";

export default class GameBoardEditor extends GameBoard {
  private EditorOptionsComponent: EditorOptions;
  private activeTileType: TileType;

  constructor(interactor: Interactor, onGameStateUpdate: (state: ILevelData) => void) {
    super(interactor, onGameStateUpdate);
    this.EditorOptionsComponent = new EditorOptions(
      this.onNewOptionsSet.bind(this),
      interactor.setCustomRules.bind(interactor),
      interactor.setCustomMoves.bind(interactor),
    );
  }

  protected startLevel(): void {
    const state = this.interactor.startEditorLevel(this.getPresenters());
    this.EditorOptionsComponent.render({ level: state });
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
    this.interactor.removeSelection();
  }

  private onNewOptionsSet = (tile: TileType) => {
    this.activeTileType = tile;
  };

  private getSelectionArguments = (x: number, y: number): [number, number, TileType] => [
    this.convertAbsoluteOffsetToProcent(x),
    this.convertAbsoluteOffsetToProcent(y),
    this.activeTileType,
  ];
}

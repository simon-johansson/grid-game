import Interactor from "@application/Interactor";
import { ILevelData, TileType } from "@application/interfaces";
import EditorOptions from "../components/EditorOptions";
import LevelSelector from "../components/LevelSelector";
import GameBoard from "./GameBoard";

export default class GameBoardEditor extends GameBoard {
  private EditorOptionsComponent: EditorOptions;
  private LevelSelectorComponent: LevelSelector;
  private activeTileType: TileType;

  constructor(interactor: Interactor) {
    super(interactor);

    this.EditorOptionsComponent = new EditorOptions(
      this.onNewOptionsSet.bind(this),
      interactor.setCustomRules.bind(interactor),
      interactor.setCustomMoves.bind(interactor),
    );
    this.LevelSelectorComponent = new LevelSelector({
      onReviewLevel: () => router("play"),
    });
  }

  protected startLevel(): void {
    const state = this.interactor.startEditorLevel(this.getPresenters());
    this.updateComponents(state);
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

  protected updateComponents(level: ILevelData): void {
    this.EditorOptionsComponent.render({ level });

    this.LevelSelectorComponent.render({
      isEditing: true,
      isReviewing: false,
    });
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

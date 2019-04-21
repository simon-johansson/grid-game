/* tslint:disable: no-unused-expression */
import Interactor from "@application/Interactor";
import { ILevelData, TileType } from "@application/interfaces";
import EditorOptions from "../components/EditorOptions";
import LevelSelector from "../components/LevelSelector";
import setAppHTML from "../utils/setAppHTML";
import setAppSceneClassName from "../utils/setAppSceneClassName";
import GameBoard from "./gameboard/GameBoard";

export default class Editor extends GameBoard {
  public static setScene(interactor: Interactor, router: (path: string) => void): void {
    setAppHTML(`
      <div id="editor-options"></div>
      <div id="canvas-container"></div>
      <div id="level-selection"></div>
    `);
    setAppSceneClassName("editor");
    new Editor(interactor, router);
  }

  private EditorOptionsComponent: EditorOptions;
  private LevelSelectorComponent: LevelSelector;
  private activeTileType: TileType;

  constructor(interactor: Interactor, router: (path: string) => void) {
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

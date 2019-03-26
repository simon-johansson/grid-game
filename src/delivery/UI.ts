import Interactor from "@application/Interactor";
import GameBoardEdit from "./scenes/GameBoardEditor";
import GameBoardPlayable from "./scenes/GameBoardPlayable";

export default class UserInterface {
  private isEditing: boolean;

  constructor(private interactor: Interactor) {
    this.isEditing = this.interactor.isInEditMode;
    this.createComponents();
  }

  private createComponents(): void {
    if (this.isEditing) {
      // TODO: Flytta till scenes istället
      document.getElementById('app')!.innerHTML = `
        <div id="editor-options"></div>
        <div id="canvas-container"></div>
        <div id="level-selection"></div>
      `
      const gameBoardEditor = new GameBoardEdit(this.interactor);
    } else {

      document.getElementById('app')!.innerHTML = `
        <div id="moves-counter"></div>
        <div id="canvas-container"></div>
        <div id="level-selection"></div>
      `
      const gameBoardPlaybale = new GameBoardPlayable(this.interactor);
    }
  }
}

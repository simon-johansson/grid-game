import Interactor from "@application/Interactor";
import GameBoardEditor from "./scenes/GameBoardEditor";
import GameBoardPlayable from "./scenes/GameBoardPlayable";

export default class UserInterface {
  constructor(private interactor: Interactor) {
    this.router(interactor.isInEditMode ? "edit" : "play");
  }

  private router(path: "play" | "edit" | "overview"): void {
    switch (path) {
      case "play":
        GameBoardPlayable.setScene(this.interactor, this.router.bind(this));
        break;

      case "edit":
        GameBoardEditor.setScene(this.interactor, this.router.bind(this));
        break;

      case "overview":
        console.log("overview");
        break;
    }
  }
}

import Interactor from "@application/Interactor";
import GameBoardEditor from "./scenes/GameBoardEditor";
import GameBoardPlayable from "./scenes/GameBoardPlayable";
import Overview from "./scenes/Overview";

export type RouterPaths = "play" | "edit" | "overview";

export default class UserInterface {
  constructor(private interactor: Interactor) {
    this.router(interactor.isInEditMode ? "edit" : "play");
    // this.router("overview");
  }

  // TODO: Bryt ut router till en egen komponent
  private router(path: RouterPaths, options?: any): void {
    switch (path) {
      case "play":
        GameBoardPlayable.setScene(this.interactor, this.router.bind(this), options);
        break;

      case "edit":
        GameBoardEditor.setScene(this.interactor, this.router.bind(this));
        break;

      case "overview":
        Overview.setScene(this.interactor, this.router.bind(this));
        break;
    }
  }
}

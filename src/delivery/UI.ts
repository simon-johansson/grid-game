import Interactor from "@application/Interactor";
import Editor from "./scenes/Editor";
import Overview from "./scenes/Overview";
import Playable from "./scenes/Playable";

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
        Playable.setScene(this.interactor, this.router.bind(this), options);
        break;

      case "edit":
        Editor.setScene(this.interactor, this.router.bind(this));
        break;

      case "overview":
        Overview.setScene(this.interactor, this.router.bind(this));
        break;
    }
  }
}

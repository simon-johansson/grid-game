import Modal from "./Modal";

export default class HowToPlayModal extends Modal {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected title = "How to play";
  protected bodyText = "Click and drag to turn gray tiles green. You win when all gray tiles are green.";
  protected imageURL = "/assets/how-to-play.gif";
  protected buttonText = "Start game";

  constructor(onClose?: () => void) {
    super(onClose);
  }
}

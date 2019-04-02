import Modal from "./Modal";

export default class MinSelectionModal extends Modal {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected title = "New rules";
  protected bodyText = `
    Some levels require you to select multiple bricks for each move. </br>
    The selection border is red if you need to select more bricks.
  `;
  protected imageURL = "/assets/min-selection-info.gif";
  protected buttonText = "Got it";

  constructor(onClose: () => void) {
    super(onClose);
  }
}

import Modal from "./Modal";

export default class AboutModal extends Modal {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected title = "About";
  protected bodyText = "Made by Simon Johansson and Sebastian Söderback.";
  protected imageURL = "";
  protected buttonText = "";
  protected showButton = false;
  protected closeOnOverlayClick = true;

  constructor() {
    super();
  }

  protected getModalBody(): string {
    return `
      <p>${this.bodyText}</p>
    `;
  }
}

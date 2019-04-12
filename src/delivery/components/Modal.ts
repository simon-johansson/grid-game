import Component from "./Component";

const overlayClass = "overlay";
const bodyClass = "modal-body";
const buttonClass = "modal-button";
const buttonTextClass = "modal-button-text";
const closeClass = "close-cross";

export default abstract class Modal extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected imageURL: string;
  protected additionalModalClass: string = "";
  protected showButton: boolean = true;
  protected abstract title: string;
  protected abstract bodyText: string;
  protected abstract buttonText: string;

  constructor(private onClose?: () => void) {
    super();
    this.onButtonClicked = this.onButtonClicked.bind(this);
  }

  protected HTML(): string {
    return `
    <div class="${overlayClass}">
      <div class="${bodyClass} ${this.additionalModalClass}">
        <figure class="${closeClass}">×</figure>
        <h2>${this.title}</h2>
        ${this.getModalBody()}
      </div>
    </div>
  `;
  }

  protected componentDidMount(): void {
    this.bindButtonEvent();
    // this.bindClickEvent(overlayClass, this.closeModal.bind(this));
    this.bindClickEvent(closeClass, this.closeModal.bind(this));
    this.bindClickEvent(bodyClass, (e: MouseEvent) => e.stopPropagation());
  }

  protected bindButtonEvent(): void {
    if (this.showButton) {
      this.bindClickEvent(buttonClass, this.onButtonClicked);
    }
  }

  protected unbindButtonEvent(): void {
    if (this.showButton) {
      this.removeClickEvent(buttonClass, this.onButtonClicked);
    }
  }

  protected update(): void {}

  protected getModalBody(): string {
    return `
      <p>${this.bodyText}</p>
      ${this.imageURL ? `<img src="${this.imageURL}" />` : ``}
      ${this.getModalButton()}
    `;
  }

  protected getModalButton(): string {
    return `
      <div class="${buttonClass}">
        <span class="${buttonTextClass}">${this.buttonText}</span>
      </div>
    `;
  }

  protected onButtonClicked(): void {
    this.closeModal();
  };

  protected closeModal(): void {
    if (this.onClose) this.onClose();
    this.destroy();
  }

  protected setButtonText(text: string): void {
    this.getEl(buttonTextClass)!.textContent = text;
  }
}

import Component from "./Component";

export const overlayClass = "overlay";
export const bodyClass = "modal-body";
export const titleClass = "modal-title";
export const buttonClass = "modal-button";
export const buttonTextClass = "modal-button-text";
export const closeClass = "close-cross";

export default abstract class Modal extends Component<{}> {
  public static id = "modal";
  public static outerHTML = `<div id="${Modal.id}"></div>`;
  protected wrapperElement: HTMLElement = document.getElementById(Modal.id) as HTMLElement;
  protected imageURL: string;
  protected additionalModalClass: string = "";
  protected showButton: boolean = true;
  protected closeOnOverlayClick: boolean = false;
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
        <h2 class="${titleClass}">${this.title}</h2>
        ${this.getModalBody()}
      </div>
    </div>
  `;
  }

  protected componentDidMount(): void {
    this.bindButtonEvent();
    this.bindClickEvent(closeClass, this.closeModal.bind(this));
    this.bindClickEvent(bodyClass, (e: MouseEvent) => e.stopPropagation());
    if (this.closeOnOverlayClick) {
      this.bindClickEvent(overlayClass, this.closeModal.bind(this));
    }
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
    if (this.showButton) {
      return `
        <div class="${buttonClass}">
          <span class="${buttonTextClass}">${this.buttonText}</span>
        </div>
      `;
    }
    return "";
  }

  protected onButtonClicked(): void {
    this.closeModal();
  }

  protected closeModal(): void {
    if (this.onClose) this.onClose();
    this.destroy();
  }

  protected setButtonText(text: string): void {
    this.getEl(buttonTextClass)!.textContent = text;
  }
}

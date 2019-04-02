import Component from "./Component";

const overlayClass = "overlay";
const bodyClass = "modal-body";
const buttonClass = "modal-button";
const closeClass = "close-cross";

export default abstract class Modal extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected abstract title: string;
  protected abstract bodyText: string;
  protected abstract imageURL: string;
  protected abstract buttonText: string;

  constructor(private onClose?: () => void) {
    super();
  }

  protected HTML(): string {
    return `
    <div class="${overlayClass}">
      <div class="${bodyClass}">
        <figure class="${closeClass}">×</figure>
        <h2>${this.title}</h2>
        <p>${this.bodyText}</p>
        <img src="${this.imageURL}" />
        <div class="${buttonClass}">
          <span>${this.buttonText}</span>
        </div>
      </div>
    </div>
  `;
  }

  protected componentDidMount(): void {
    // this.bindClickEvent(overlayClass, this.closeModal.bind(this));
    this.bindClickEvent(buttonClass, this.closeModal.bind(this));
    this.bindClickEvent(closeClass, this.closeModal.bind(this));
    this.bindClickEvent(bodyClass, (e: MouseEvent) => e.stopPropagation());
  }

  protected update(): void {}

  private closeModal(): void {
    if (this.onClose) this.onClose();
    this.destroy();
  }
}

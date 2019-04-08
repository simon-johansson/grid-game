import Component from "./Component";

const overlayClass = "overlay";
const bodyClass = "modal-body";
const emailInputClass = "email-address";
const buttonClass = "modal-button";
const buttonTextClass = "modal-button-text";
const submitFeedbackClass = "submit-feedback";
const closeClass = "close-cross";

export default abstract class Modal extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("modal") as HTMLElement;
  protected abstract title: string;
  protected abstract bodyText: string;
  protected abstract imageURL: string;
  protected abstract buttonText: string;
  private buttonTextDuringSubmit: string = "Sending...";
  private buttonTextAfterSubmit: string = "Close";
  private hasSubmitted: boolean = false;
  private emailAddress: string;

  constructor(private onClose?: () => void, private onSubmit?: (address: string) => Promise<void>) {
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
        ${this.onSubmit ? `<input type="email" class="${emailInputClass}" placeholder="Your email address">` : ""}
        <div class="${submitFeedbackClass}"></div>
        <div class="${buttonClass}">
          <span class="${buttonTextClass}">${this.buttonText}</span>
        </div>
      </div>
    </div>
  `;
  }

  protected componentDidMount(): void {
    // this.bindClickEvent(overlayClass, this.closeModal.bind(this));
    this.bindClickEvent(buttonClass, this.onButtonClicked);
    this.bindClickEvent(closeClass, this.closeModal);
    this.bindClickEvent(bodyClass, (e: MouseEvent) => e.stopPropagation());
    if (this.onSubmit) {
      this.bindChangeEvent(emailInputClass, this.onEmailInput);
    }
  }

  protected update(): void {}

  private onButtonClicked = async (): Promise<void> => {
    if (this.shouldSendEmail) {
      if (this.isAddressValid) this.sendEmail();
      else this.onInvalidEmail();
    } else this.closeModal();
  };

  private sendEmail = async (): Promise<void> => {
    this.removeClickEvent(buttonClass, this.onButtonClicked);
    this.setButtonText(this.buttonTextDuringSubmit);
    try {
      await this.onSubmit!(this.emailAddress);
      this.showSubmitFeedback();
    } catch (error) {
      this.showSubmitFeedback(error);
    }
  };

  private showSubmitFeedback(error?: string): void {
    this.bindClickEvent(buttonClass, this.onButtonClicked);

    if (error) {
      this.setButtonText(this.buttonText);
      this.showSubmitErrorFeedback(error)
    }
    else {
      this.hasSubmitted = true;
      this.getEl<HTMLInputElement>(emailInputClass)!.readOnly = true;
      this.setButtonText(this.buttonTextAfterSubmit);
      this.showSubmitSuccessFeedback();
    }
  }

  private showSubmitSuccessFeedback(): void {
    const el = this.getEl(submitFeedbackClass)!;
    el.innerHTML = `
      <p class="success">Thank you! 👍</p>
      <p>We will be in touch</p>
    `;
    el.classList.remove("hidden");
  }

  private showSubmitErrorFeedback(error?: string): void {
    const el = this.getEl(submitFeedbackClass)!;
    el.innerHTML = `
      <p class="error">Oh no! Failed to send 😥</p>
      ${error ? `<p>${error}</p>` : `<p>Something went wrong.</br>Please try again later</p>`}
    `;
    el.classList.remove("hidden");
  }

  private closeModal = (): void => {
    if (this.onClose) this.onClose();
    this.hasSubmitted = false;
    this.destroy();
  };

  private onEmailInput = (event: any) => {
    this.emailAddress = event.currentTarget.value;
    if (this.isAddressValid) this.onValidEmail();
    else this.onInvalidEmail();
  };

  private onInvalidEmail(): void {
    this.getEl(emailInputClass)!.classList.add("invalid");
  }

  private onValidEmail(): void {
    this.getEl(emailInputClass)!.classList.remove("invalid");
  }

  private setButtonText(text: string): void {
    this.getEl(buttonTextClass)!.textContent = text;
  }

  private get shouldSendEmail(): boolean {
    return this.onSubmit !== undefined && !this.hasSubmitted;
  }

  private get isAddressValid(): boolean {
    return /(.+)@(.+){2,}\.(.+){2,}/.test(this.emailAddress);
  }
}

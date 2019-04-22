import Modal from "./Modal";

const modalClass = "stay-informed-modal";
const emailInputClass = "email-address";
const submitFeedbackClass = "submit-feedback";

export default class StayInformedModal extends Modal {
  protected title = "Extra levels";
  protected bodyText = `
    We are working on adding more levels.
    Enter your email if you want to get notified when new levels are released.
  `;
  protected buttonText = "Keep me updated";
  protected additionalModalClass = modalClass;

  private hasSubmitted: boolean = false;
  private emailAddress: string;
  private buttonTextDuringSubmit: string = "Sending...";
  private buttonTextAfterSubmit: string = "Close";

  constructor(private callbacks: { onClose?: () => void; onSubmit: (address: string) => Promise<void> }) {
    super(callbacks.onClose);
  }

  protected getModalBody(): string {
    return `
      <p>${this.bodyText}</p>
      <input type="email" class="${emailInputClass}" placeholder="Your email address">
      <div class="${submitFeedbackClass}"></div>
      ${this.getModalButton()}
    `;
  }

  protected componentDidMount(): void {
    super.componentDidMount();
    this.bindChangeEvent(emailInputClass, this.onEmailInput);
  }

  protected onButtonClicked = (): void => {
    if (!this.hasSubmitted) {
      if (this.isAddressValid) this.sendEmail();
      else this.onInvalidEmail();
    } else this.closeModal();
  };

  protected closeModal(): void {
    this.hasSubmitted = false;
    super.closeModal();
  }

  private onEmailInput = (event: any) => {
    this.emailAddress = event.currentTarget.value;
    if (this.isAddressValid) this.onValidEmail();
    else this.onInvalidEmail();
  };

  private sendEmail = async (): Promise<void> => {
    this.unbindButtonEvent();
    this.setButtonText(this.buttonTextDuringSubmit);
    try {
      await this.callbacks.onSubmit(this.emailAddress);
      this.showSubmitFeedback();
    } catch (error) {
      this.showSubmitFeedback(error);
    }
  };

  private showSubmitFeedback(error?: string): void {
    this.bindButtonEvent();

    if (error) {
      this.setButtonText(this.buttonText);
      this.showSubmitErrorFeedback(error);
    } else {
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

  private onInvalidEmail(): void {
    this.getEl(emailInputClass)!.classList.add("invalid");
  }

  private onValidEmail(): void {
    this.getEl(emailInputClass)!.classList.remove("invalid");
  }

  private get isAddressValid(): boolean {
    return /(.+)@(.+){2,}\.(.+){2,}/.test(this.emailAddress);
  }
}

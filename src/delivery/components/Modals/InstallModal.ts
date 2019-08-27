import Modal from "./Modal";

export const modalClass = "install-modal";
export const safariModalClass = "safari-specific";
export const perksListClass = "perks-list";
export const iosInstructionsClass = "ios-instructions";
export const iosExportIconClass = "ios-export";

export default class InstallModal extends Modal {
  protected title = "Add to homescreen";
  protected bodyText = "You can add GridGame to your home screen to get the following perks.";
  protected buttonText = "Install now!";
  protected showButton = true;
  protected additionalModalClass = modalClass;

  constructor(private options: { onClose: () => void; onInstall: () => void; installViaButton: boolean }) {
    super(options.onClose);
    this.additionalModalClass += this.options.installViaButton ? "" : ` ${safariModalClass}`;
    this.showButton = this.options.installViaButton;
  }

  protected getModalBody(): string {
    return `
      <p>${this.bodyText}</p>
      ${this.addToHomescreenHTML()}
      ${this.options.installViaButton ? this.getModalButton() : ""}
    `;
  }

  protected addToHomescreenHTML(): string {
    return `
      <ul class="${perksListClass}">
        <li>Play while offline</li>
        <li>Play in fullscreen</li>
        <li>Get a fancy app icon</li>
      </ul>
      ${this.getSafariInstructions()}
    `;
  }

  protected getSafariInstructions(): string {
    if (!this.options.installViaButton) {
      return `
        <p class="${iosInstructionsClass}">
          Press <img class="${iosExportIconClass}" src="/assets/export@2x.png" /> and then “Add to Home Screen”
        </p>
      `;
    }
    return "";
  }

  protected onButtonClicked(): void {
    this.options.onInstall();
    super.onButtonClicked();
  }

  protected get shouldInstall(): boolean {
    return !!this.options.onInstall;
  }
}

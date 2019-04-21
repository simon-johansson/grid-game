import Modal from "./Modal";

const modalClass = "about-modal";
const facebookBtn = "facebook-share";
const twitterBtn = "twitter-share";

export default class AboutModal extends Modal {
  protected title = "About";
  protected bodyText = "";
  protected imageURL = "";
  protected buttonText = "";
  protected showButton = false;
  protected closeOnOverlayClick = true;
  protected additionalModalClass = modalClass;
  private sharingURL: string = "https://gridgame.net";

  constructor() {
    super();
  }

  protected getModalBody(): string {
    return `
      <p>
        GridGame is made by
        <a href="http://sebastiansoderback.com/" target="_blank">Sebastian Söderback</a> and
        <a href="https://www.linkedin.com/in/simon-johansson-57987558/" target="_blank">Simon Johansson</a>.
      </p>

      <p>Like the game? Please share the link <a href="${this.sharingURL}">gridgame.net</a> or use one of the buttons below. Thanks! 💕</p>

      <div class="sharing">
        <div class="sharing-button ${facebookBtn}">Share</div>
        <div class="sharing-button ${twitterBtn}">Tweet</div>
      </div>
    `;
  }

  protected componentDidMount(): void {
    super.componentDidMount();
    this.bindClickEvent(facebookBtn, this.onFacebookShare.bind(this));
    this.bindClickEvent(twitterBtn, this.onTwitterShare.bind(this));
  }

  private onFacebookShare(): void {
    this.openShareDialog(`https://www.facebook.com/sharer/sharer.php?u=${escape(this.sharingURL)}`);
  }

  private onTwitterShare(): void {
    this.openShareDialog(`https://twitter.com/share?url=${escape(this.sharingURL)}`);
  }

  private openShareDialog(href: string): void {
    const width = 650;
    const height = 450;
    const top = screen.height / 2 - height / 2;
    const left = screen.width / 2 - width / 2;
    window.open(
      href,
      "Share Dialog",
      `menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=${width},height=${height},top=${top},left=${left}`,
    );
  }
}

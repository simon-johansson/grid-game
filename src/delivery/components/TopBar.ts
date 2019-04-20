import AboutModal from "./AboutModal";
import Component from "./Component";

export const aboutBtnClass = "about";
export const feedbackBtnClass = "feedback";

export default class TopBar extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("top-bar") as HTMLElement;
  private AboutModalComponent = new AboutModal();

  constructor() {
    super();
  }

  protected HTML(): string {
    return `
      <div class="tab-button ${aboutBtnClass}">About</div>
      <div class="tab-button ${feedbackBtnClass}">Feedback</div>
  `;
  }

  protected componentDidMount(): void {
    this.bindClickEvent(aboutBtnClass, this.onAboutTabClicked.bind(this));
    this.bindClickEvent(feedbackBtnClass, this.onFeedbackTabClicked.bind(this));
  }

  protected update(): void {}

  private onAboutTabClicked(): void {
    this.AboutModalComponent.render({});
  }

  private onFeedbackTabClicked(): void {
    (window as any).doorbell.show();
  }
}

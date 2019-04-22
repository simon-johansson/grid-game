import Component from "./Component";
import AboutModal from "./Modals/AboutModal";

export const aboutBtnClass = "about";
export const feedbackBtnClass = "feedback";

export default class TopBar extends Component<{}> {
  public static id = "top-bar";
  public static outerHTML = `<div id="${TopBar.id}"></div>`;
  protected wrapperElement: HTMLElement = document.getElementById(TopBar.id) as HTMLElement;
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

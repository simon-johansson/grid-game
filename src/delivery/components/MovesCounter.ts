import Component from "./Component";

const counterWrapperClass = "counter-number-wrapper";
const counterClass = "counter-number";

export interface IProps {
  selectionsLeft: number | undefined;
  selectionsMade: number;
  isLevelCleared: boolean;
}

export default class MovesLeft extends Component<IProps> {
  protected wrapperElement: HTMLElement = document.getElementById("moves-counter");

  protected HTML(props: IProps): string {
    return `
      <div class="inner-wrapper">
        <div class="counter-number-wrapper"></div>
        <span class="counter-description">moves left</span>
      </div>
  `;
  }

  protected update({ selectionsLeft, selectionsMade, isLevelCleared }: IProps): void {
    const moves = selectionsLeft !== undefined ? selectionsLeft : selectionsMade;
    const isLevelFailed = !isLevelCleared && moves === 0;

    this.removeNumberElement();
    this.getEl(counterWrapperClass).appendChild(this.createNumberElement(moves));
    this.getEl(counterWrapperClass).className = `${counterWrapperClass} ${isLevelCleared &&
      "cleared"} ${isLevelFailed && "failed"}`;
  }

  private removeNumberElement() {
    if (this.getEls(counterClass).length) {
      [].forEach.call(this.getEls(counterClass), (el: Element) => {
        el.classList.remove("new");
      });
    }
  }

  private createNumberElement(moves: number): HTMLElement {
    const el = document.createElement("figure");
    el.className = `${counterClass} new`;
    el.textContent = `${moves}`;
    el.addEventListener("transitionend", e => el.remove(), false);
    return el;
  }
}

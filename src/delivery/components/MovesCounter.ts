import Component from "./Component";

export interface IProps {
  selectionsLeft: number | undefined;
  selectionsMade: number;
  isLevelCleared: boolean;
  minSelection: number;
}

const counterWrapperClass = "counter-number-wrapper";
const counterClass = "counter-number";
const minSelectionWrapperClass = "min-selection-indicator";
const minSelectionNumberClass = "min-selection-number";

export default class MovesLeft extends Component<IProps> {
  protected wrapperElement: HTMLElement = document.getElementById("moves-counter") as HTMLElement;

  public get counterWrapperElement(): HTMLElement {
    return this.getEl(counterWrapperClass) as HTMLElement;
  }

  public get counterClassElements(): NodeList {
    return this.getEls(counterClass);
  }

  protected HTML(porps: IProps): string {
    return `
      <div class="inner-wrapper">
        <div class="${counterWrapperClass}">
          <div class="${minSelectionWrapperClass}">
            <span>MIN</span><figure class="${minSelectionNumberClass}"></figure>
          </div>
        </div>
        <span class="counter-description">moves left</span>
      </div>
  `;
  }

  protected update({ selectionsLeft, selectionsMade, isLevelCleared, minSelection }: IProps): void {
    const moves = selectionsLeft !== undefined ? selectionsLeft : selectionsMade;
    const isLevelFailed = !isLevelCleared && moves === 0;

    this.removeNumberElement();
    this.counterWrapperElement.appendChild(this.createNumberElement(moves));
    this.counterWrapperElement.className = `${counterWrapperClass} ${isLevelCleared && "cleared"} ${isLevelFailed &&
      "failed"}`;

    this.setMinSelectionIndicator(minSelection);
  }

  private removeNumberElement(): void {
    if (this.counterClassElements.length) {
      [].forEach.call(this.counterClassElements, (el: Element) => {
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

  private setMinSelectionIndicator(minSelection: number): void {
    const shouldHide = minSelection === 1;
    this.getEl(minSelectionWrapperClass)!.classList.toggle('hide', shouldHide)
    this.getEl(minSelectionNumberClass)!.textContent = minSelection.toString();
  }
}

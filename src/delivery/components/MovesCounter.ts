import BaseComponent from "./BaseComponent";

const counterClass = 'counter-number';
const deascriptionClass = 'counter-description';

export interface IProps {
  selectionsLeft: number | undefined,
  selectionsMade: number,
  isLevelCleared: boolean
}

export default class MovesLeft extends BaseComponent {
  protected wrapperElement: HTMLElement = document.getElementById("moves-counter");

  public render(options: IProps): void {
    this.wrapperElement.innerHTML = this.HTML(options);
  }

  private HTML({ selectionsLeft, selectionsMade, isLevelCleared }: IProps): string {
    const moves = selectionsLeft !== undefined ? selectionsLeft : selectionsMade;
    const isLevelFailed = !isLevelCleared && moves === 0;

    return `
      <figure class="${counterClass} ${isLevelCleared && 'cleared'} ${isLevelFailed && 'failed'}">
        ${moves}
      </figure>
      <span class="${deascriptionClass}">moves left</span>
  `;
  }
}

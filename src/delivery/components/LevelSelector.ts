import BaseComponent from "./BaseComponent";

const prevBtnClass = "prev";
const nextBtnClass = "next";
const restartBtnClass = "restart";
const currentLevelClass = "current-level";

export interface IProps {
  currentLevel: number;
  isLastLevel: boolean;
}

export default class LevelSelector extends BaseComponent {
  protected wrapperElement: HTMLElement = document.getElementById("level-selection");

  constructor(private onPrevLevel: () => void, private onNextLevel: () => void, private onRestart: () => void) {
    super();
  }

  public render(options: IProps): void {
    this.wrapperElement.innerHTML = this.HTML(options);
    this.bindEvents();
  }

  private HTML({ currentLevel, isLastLevel }: IProps): string {
    const isFirstLevel = currentLevel === 0;

    return `
    <span class="${prevBtnClass} ${isFirstLevel && "disable"}">
      <img src="/assets/arrowThickLeft@3x.png" />
    </span>

    <span class="${currentLevelClass}">
      Level ${currentLevel + 1}
    </span>

    <span class="${nextBtnClass} ${isLastLevel && "disable"}">
      <img src="/assets/arrowThickLeft@3x.png" />
    </span>

    <span class="${restartBtnClass}">
      <img src="/assets/reload@3x.png" />
    </span>
  `;
  }

  private bindEvents() {
    this.bindEvent(prevBtnClass, this.onPrevLevel);
    this.bindEvent(nextBtnClass, this.onNextLevel);
    this.bindEvent(restartBtnClass, this.onRestart);
  }
}

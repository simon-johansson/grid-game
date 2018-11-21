import Component from "./Component";

const prevBtnClass = "prev";
const nextBtnClass = "next";
const restartBtnClass = "restart";
const currentLevelClass = "current-level";

export interface IProps {
  currentLevel: number;
  isLastLevel: boolean;
}

export default class LevelSelector extends Component<IProps> {
  protected wrapperElement: HTMLElement = document.getElementById("level-selection");

  constructor(private onPrevLevel: () => void, private onNextLevel: () => void, private onRestart: () => void) {
    super();
  }

  protected HTML(props: IProps): string {
    return `
    <div class="inner-wrapper">
      <span class="${prevBtnClass}">
      <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${currentLevelClass}"></span>

      <span class="${nextBtnClass}">
      <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${restartBtnClass}">
      <img src="/assets/reload@3x.png" />
      </span>
    </div>
  `;
  }

  protected componentDidMount() {
    this.bindEvent(prevBtnClass, this.onPrevLevel);
    this.bindEvent(nextBtnClass, this.onNextLevel);
    this.bindEvent(restartBtnClass, this.onRestart);
  }

  protected update({ currentLevel, isLastLevel }: IProps) {
    const isFirstLevel = currentLevel === 0;

    this.getEl(currentLevelClass).textContent = `Level ${currentLevel + 1}`;
    this.getEl(prevBtnClass).className = `${prevBtnClass} ${isFirstLevel && "disable"}`;
    this.getEl(nextBtnClass).className = `${nextBtnClass} ${isLastLevel && "disable"}`;
  }
}

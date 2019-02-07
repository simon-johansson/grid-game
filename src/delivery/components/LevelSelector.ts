import Component from "./Component";

const prevBtnClass = "prev";
const nextBtnClass = "next";
const restartBtnClass = "restart";
const reviewBtnClass = "play";
const editBtnClass = "edit";
const currentLevelClass = "current-level";

export interface IProps {
  currentLevel: number;
  isLastLevel: boolean;
}

export default class LevelSelector extends Component<IProps> {
  protected wrapperElement: HTMLElement = document.getElementById("level-selection");
  private isPlaying: boolean = true;
  private isReviewing: boolean;

  constructor(
    private onPrevLevel: () => void,
    private onNextLevel: () => void,
    private onRestart: () => void,
    private onReviewLevel: () => void,
    private onEditLevel: () => void,
    private isEditing: boolean,
    hasLoadedCustomLevel: boolean
  ) {
    super();
    this.isReviewing = hasLoadedCustomLevel && !this.isEditing;

    if (this.isEditing || this.isReviewing) {
      this.isPlaying = false;
      this.render({
        currentLevel: 0,
        isLastLevel: false
      });
    }
  }

  protected HTML(props: IProps): string {
    return `
    <div class="inner-wrapper">
      <span class="${prevBtnClass} ${!this.isPlaying && 'disable'}">
        <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${currentLevelClass}"></span>

      <span class="${nextBtnClass} ${!this.isPlaying && 'disable'}">
        <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${reviewBtnClass} ${!this.isEditing && 'hide'}">
        <small>Test &#8594;</small>
      </span>

      <span class="${editBtnClass} ${!this.isReviewing && 'hide'}">
        <small>&#8592; Edit</small>
      </span>

      <span class="${restartBtnClass} ${this.isEditing && 'hide'}">
        <img src="/assets/reload@3x.png" />
      </span>
    </div>
  `;
  }

  protected componentDidMount() {
    this.bindEvent(prevBtnClass, this.onPrevLevel);
    this.bindEvent(nextBtnClass, this.onNextLevel);
    this.bindEvent(restartBtnClass, this.onRestart);
    this.bindEvent(reviewBtnClass, this.onReviewLevel);
    this.bindEvent(editBtnClass, this.onEditLevel);
  }

  protected update({ currentLevel, isLastLevel }: IProps) {
    if (this.isEditing) {
      this.getEl(currentLevelClass).textContent = "Level editor";
    } else if (this.isReviewing) {
      this.getEl(currentLevelClass).textContent = "Review level";
    } else if (this.isPlaying) {
      const isFirstLevel = currentLevel === 0;
      this.getEl(currentLevelClass).textContent = `Level ${currentLevel + 1}`;
      this.getEl(prevBtnClass).className = `${prevBtnClass} ${isFirstLevel && "disable"}`;
      this.getEl(nextBtnClass).className = `${nextBtnClass} ${isLastLevel && "disable"}`;
    }
  }
}

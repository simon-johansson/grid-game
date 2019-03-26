import Component from "./Component";

const prevBtnClass = "prev";
const nextBtnClass = "next";
const restartBtnClass = "restart";
const reviewBtnClass = "play";
const editBtnClass = "edit";
const currentLevelClass = "current-level";

export interface IProps {
  currentLevel?: number;
  isLastLevel?: boolean;
  isFirstLevel?: boolean;
  isEditing: boolean;
  isReviewing: boolean;
}

export default class LevelSelector extends Component<IProps> {
  protected wrapperElement: HTMLElement = document.getElementById("level-selection") as HTMLElement;

  constructor(
    private onPrevLevel: () => void,
    private onNextLevel: () => void,
    private onRestart: () => void,
    private onReviewLevel: () => void,
    private onEditLevel: () => void,
  ) {
    super();
  }

  protected HTML({ isEditing, isReviewing }: IProps): string {
    const isPlaying = !isEditing && !isReviewing ? true : false;

    return `
    <div class="inner-wrapper">
      <span class="${prevBtnClass} ${!isPlaying && "disable"}">
        <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${currentLevelClass}"></span>

      <span class="${nextBtnClass} ${!isPlaying && "disable"}">
        <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${reviewBtnClass} ${!isEditing && "hide"}">
        <small>Test &#8594;</small>
      </span>

      <span class="${editBtnClass} ${!isReviewing && "hide"}">
        <small>&#8592; Edit</small>
      </span>

      <span class="${restartBtnClass} ${isEditing && "hide"}">
        <img src="/assets/reload@3x.png" />
      </span>
    </div>
  `;
  }

  protected componentDidMount(): void {
    this.bindClickEvent(prevBtnClass, this.onPrevLevel);
    this.bindClickEvent(nextBtnClass, this.onNextLevel);
    this.bindClickEvent(restartBtnClass, this.onRestart);
    this.bindClickEvent(reviewBtnClass, this.onReviewLevel);
    this.bindClickEvent(editBtnClass, this.onEditLevel);
  }

  protected update({ currentLevel, isFirstLevel, isLastLevel, isEditing, isReviewing }: IProps): void {
    if (isEditing) this.updateEditingView();
    else if (isReviewing) this.updateReviewingView();
    else this.updatePlayingView(currentLevel!, isFirstLevel!, isLastLevel!);
  }

  private updateEditingView(): void {
    this.getEl(currentLevelClass)!.textContent = "Level editor";
  }
  private updateReviewingView(): void {
    this.getEl(currentLevelClass)!.textContent = "Review level";
  }
  private updatePlayingView(currentLevel: number, isFirstLevel: boolean, isLastLevel: boolean): void {
    this.getEl(currentLevelClass)!.textContent = `Level ${currentLevel + 1}`;
    this.getEl(prevBtnClass)!.className = `${prevBtnClass} ${isFirstLevel && "disable"}`;
    this.getEl(nextBtnClass)!.className = `${nextBtnClass} ${isLastLevel && "disable"}`;
  }
}

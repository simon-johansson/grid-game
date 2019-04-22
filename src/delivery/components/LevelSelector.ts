import Component from "./Component";

export const prevBtnClass = "prev";
export const nextBtnClass = "next";
export const restartBtnClass = "restart";
export const reviewBtnClass = "play";
export const editBtnClass = "edit";
export const currentLevelClass = "current-level";

interface ICallbacks {
  onPrevLevel?: () => void;
  onNextLevel?: () => void;
  onRestart?: () => void;
  onReviewLevel?: () => void;
  onEditLevel?: () => void;
  onGoToOverview?: () => void;
}

export interface IProps {
  currentLevel?: number;
  isLastLevel?: boolean;
  isFirstLevel?: boolean;
  isEditing: boolean;
  isReviewing: boolean;
}

export default class LevelSelector extends Component<IProps> {
  public static id = "level-selection";
  public static outerHTML = `<div id="${LevelSelector.id}"></div>`;
  protected wrapperElement: HTMLElement = document.getElementById(LevelSelector.id) as HTMLElement;

  constructor(private callbacks: ICallbacks) {
    super();
  }

  protected HTML({ isEditing, isReviewing }: IProps): string {
    const isPlaying = !isEditing && !isReviewing ? true : false;

    return `
    <div class="inner-wrapper">
      <span class="${prevBtnClass} ${!isPlaying && "disabled"}">
        <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${currentLevelClass}"></span>

      <span class="${nextBtnClass} ${!isPlaying && "disabled"}">
        <img src="/assets/arrowThickLeft@3x.png" />
      </span>

      <span class="${reviewBtnClass} ${!isEditing && "hidden"}">
        <small>Test</small>
      </span>

      <span class="${editBtnClass} ${!isReviewing && "hidden"}">
        <small>Edit</small>
      </span>

      <span class="${restartBtnClass} ${isEditing && "hidden"}">
        <img src="/assets/reload@3x.png" />
      </span>
    </div>
  `;
  }

  protected componentDidMount(): void {
    const { onPrevLevel, onNextLevel, onRestart, onReviewLevel, onEditLevel, onGoToOverview } = this.callbacks;
    if (onPrevLevel) this.bindClickEvent(prevBtnClass, onPrevLevel);
    if (onNextLevel) this.bindClickEvent(nextBtnClass, onNextLevel);
    if (onRestart) this.bindClickEvent(restartBtnClass, onRestart);
    if (onReviewLevel) this.bindClickEvent(reviewBtnClass, onReviewLevel);
    if (onEditLevel) this.bindClickEvent(editBtnClass, onEditLevel);
    if (onGoToOverview) this.bindClickEvent(currentLevelClass, onGoToOverview);
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
    this.getEl(currentLevelClass)!.textContent = `Level ${currentLevel}`;
    this.getEl(prevBtnClass)!.className = `${prevBtnClass} ${isFirstLevel && "disabled"}`;
    this.getEl(nextBtnClass)!.className = `${nextBtnClass} ${isLastLevel && "disabled"}`;
  }
}

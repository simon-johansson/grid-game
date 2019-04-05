/* tslint:disable: no-unused-expression no-empty-interface */
import Interactor from "@application/Interactor";
import { IOverviewData, IStage } from "@application/interfaces";
import Component from "../components/Component";
import { RouterPaths } from "../UI";
import setAppHTML from "./setAppHTML";

export interface IProps extends IOverviewData {}

// TODO: Spara selectorer i variabler utanför klassen
export default class Overview extends Component<IProps> {
  public static setScene(interactor: Interactor, router: (path: RouterPaths, options?: any) => void): void {
    setAppHTML(`
      <div id="overview"></div>
    `);
    new Overview(interactor, router);
  }

  protected wrapperElement: HTMLElement = document.getElementById("overview") as HTMLElement;
  private stages: IStage[];
  private activeStage: IStage;

  constructor(private interactor: Interactor, private router: (path: RouterPaths, options?: any) => void) {
    super();

    this.interactor.loadLevels().then(() => {
      const data = this.interactor.getOverviewData();
      this.stages = data.stages;
      this.activeStage = this.stages.find(stage => stage.isPlaying) || this.stages[0];
      this.render(data);
    });
  }

  protected HTML({ cleared, total }: IProps): string {
    return `
      <div class="inner-wrapper">
        <div class="header">
          <div class="back">Back</div>
          <div class="progress">
            ${cleared}/${total}
            <span class="progress-icon"></span>
          </div>
        </div>
        <div class="stages"></div>
        <div class="levels"></div>
      </div>
  `;
  }

  protected componentDidMount(): void {
    this.bindClickEvent("back", this.onGoBack.bind(this));
  }

  protected update(): void {
    this.getEl("levels")!.innerHTML = this.createLevels();
    this.getEl("stages")!.innerHTML = this.createStages() + this.createLockedStages();
    this.bindStageSelect();
    this.bindLevelSelect();
  }

  private createStages(): string {
    return this.stages
      .slice(0, 3)
      .map((stage, index) => {
        const isActive = this.activeStage === stage;
        return `
          <div class="stage stage-${index} ${stage.isCleared && "cleared"} ${isActive && "active"}">
            <span>${this.getRomanNumber(index + 1)}</span>
          </div>
        `;
      })
      .join("");
  }

  private createLockedStages(): string {
    return Array.from({ length: 2 }, () => {
      return `
      <div class="stage locked"></div>
    `;
    }).join("");
  }

  private createLevels(): string {
    const len = this.activeStage.levels.length;
    let html = this.activeStage.levels
      .map(({ hasCompleted, name, isCurrentlyPlaying }, index) => {
        return `
          <div class="level level-${index} ${hasCompleted && "cleared"} ${isCurrentlyPlaying && "active"}">
            ${name}
          </div>`;
      })
      .join("");

    if (len < 25) {
      html += createFillterLevels();
    }

    return html;

    function createFillterLevels(): string {
      let result = "";
      if (len < 25) {
        for (let i = 0; i < 25 - len; i++) {
          result += `<div class="level hidden"></div>`;
        }
      }
      return result;
    }
  }

  private bindStageSelect(): void {
    this.stages.forEach((stage, index) =>
      this.bindClickEvent(`stage-${index}`, this.onStageSelected.bind(this, stage)),
    );
    this.bindClickEvent("locked", this.onClickedLockStage.bind(this));
  }

  private bindLevelSelect(): void {
    this.activeStage.levels.forEach((level, index) =>
      this.bindClickEvent(`level-${index}`, this.onLevelSelected.bind(this, level.id)),
    );
  }

  private onStageSelected(stage: IStage): void {
    this.activeStage = stage;
    this.update();
  }

  private onLevelSelected(levelID: number): void {
    this.router("play", { levelID });
  }

  private onGoBack(): void {
    this.router("play");
  }

  private onClickedLockStage(): void {
    console.log('locked!');
  }

  private getRomanNumber(num: number): string {
    if (num === 1) return "I";
    if (num === 2) return "II";
    if (num === 3) return "III";
    if (num === 4) return "IV";
    if (num === 5) return "V";
    return num.toString();
  }
}

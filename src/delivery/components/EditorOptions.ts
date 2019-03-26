import { IGameRules, ILevelData, TileType } from "@application/interfaces";
import Component from "./Component";

const regularTileClass = "regular";
const clearedTileClass = "cleared";
const blockerTileClass = "blocker";
const movesClass = "moves";
const minSelectionClass = "minselection";
const overlapClass = "overlap";

export interface IProps {
  level: ILevelData;
}

export default class EditorOptions extends Component<IProps> {
  protected wrapperElement: HTMLElement = document.getElementById("editor-options") as HTMLElement;
  private tile: TileType = TileType.Regular;
  private rules: IGameRules = {};

  constructor(
    private onSetTileType: (tile: TileType) => void,
    private onSetCustomRules: (rules: IGameRules) => void,
    private onSetCustomMoves: (moves: number) => void,
  ) {
    super();
  }

  protected HTML({ level }: IProps): string {
    const { toggleOnOverlap, minSelection } = level.rules;
    const moves = level.selections.left;
    this.setRulesFromLevel(level);

    return `
      <div class="moves-picker">
        <label for="moves-input">Number of moves:</label>
        <input type="number" class="${movesClass}" id="moves-input" value="${moves}">
      </div>
      <div class="minselection-picker">
        <label for="minselection-input">Minimum tiles selected:</label>
        <input type="number" class="${minSelectionClass}" id="minselection-input" value="${minSelection}">
      </div>
      <div class="overlap-picker">
        <label for="overlap-select">Should toggle on overlap:</label>
        <select id="overlap-select" class="${overlapClass}">
          <option value="true" ${toggleOnOverlap && "selected"}>Yes</option>
          <option value="false" ${!toggleOnOverlap && "selected"}>No</option>
        </select>
      </div>
      <div class="tile-picker">
        <figure class="${regularTileClass} selected"></figure>
        <figure class="${clearedTileClass}"></figure>
        <figure class="${blockerTileClass}"></figure>
      </div>
  `;
  }

  protected componentDidMount(): void {
    this.bindEvent(regularTileClass, this.setTileOptions.bind(this, TileType.Regular, regularTileClass));
    this.bindEvent(clearedTileClass, this.setTileOptions.bind(this, TileType.Cleared, clearedTileClass));
    this.bindEvent(blockerTileClass, this.setTileOptions.bind(this, TileType.Blocker, blockerTileClass));
    this.bindChangeEvent(movesClass, this.setMovesOption.bind(this));
    this.bindChangeEvent(minSelectionClass, this.setMinSelectionOption.bind(this));
    this.bindChangeEvent(overlapClass, this.setToggleOnOverlapOption.bind(this));
  }

  protected update({ level }: IProps): void {}

  private setRulesFromLevel(level: ILevelData): void {
    this.rules.minSelection = level.rules.minSelection;
    this.rules.toggleOnOverlap = level.rules.toggleOnOverlap;
  }

  private setTileOptions = (tileType: TileType, elementClass: string) => {
    this.tile = tileType;
    this.setTileClass(elementClass);
    this.onSetTileType(this.tile);
  };

  private setMovesOption = (inputEvent: any) => {
    this.onSetCustomMoves(JSON.parse(inputEvent.currentTarget.value));
  };

  private setMinSelectionOption = (inputEvent: any) => {
    this.rules.minSelection = JSON.parse(inputEvent.currentTarget.value);
    this.onSetCustomRules(this.rules);
  };

  private setToggleOnOverlapOption = (inputEvent: any) => {
    this.rules.toggleOnOverlap = JSON.parse(inputEvent.currentTarget.value);
    this.onSetCustomRules(this.rules);
  };

  private setTileClass(elementClass: string): void {
    [regularTileClass, clearedTileClass, blockerTileClass].forEach(el => {
      const classList = this.getEl(el)!.classList;
      elementClass === el ? classList.add("selected") : classList.remove("selected");
    });
  }
}

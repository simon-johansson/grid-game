import { IGameRules, TileType } from "@application/interfaces";
import QueryStringHandler from "../utils/QueryStringHandler";
import Component from "./Component";

const regularTileClass = "regular";
const clearedTileClass = "cleared";
const blockerTileClass = "blocker";
const movesClass = "moves";
const minSelectionClass = "minselection";
const overlapClass = "overlap";

export interface ISelectedOptions {
  tile: TileType;
  moves: number;
  rules: IGameRules;
}

export default class EditorOptions extends Component<{}> {
  protected wrapperElement: HTMLElement = document.getElementById("editor-options");
  private queryString = new QueryStringHandler();
  private options: ISelectedOptions = {
    tile: TileType.Regular,
    moves: 3,
    rules: {
      minSelection: 1,
      toggleOnOverlap: true,
    },
  };

  constructor(private onNewOptionsSet: (options: ISelectedOptions) => void) {
    super();
    const { moves, minSelection, toggleOnOverlap } = this.queryString;
    if (moves !== null) {
      this.options.moves = moves;
    }
    if (minSelection !== null) {
      this.options.rules.minSelection = minSelection;
    }
    if (toggleOnOverlap !== null) {
      this.options.rules.toggleOnOverlap = toggleOnOverlap;
    }
    this.render({});
    // onNewOptionsSet(this.options);
  }

  protected HTML(props: {}): string {
    const { toggleOnOverlap, minSelection } = this.options.rules;

    return `
      <div class="moves-picker">
        <label for="moves-input">Number of moves:</label>
        <input type="number" class="${movesClass}" id="moves-input" value="${this.options.moves}">
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

  protected componentDidMount() {
    this.bindEvent(regularTileClass, this.setTileOptions.bind(this, TileType.Regular, regularTileClass));
    this.bindEvent(clearedTileClass, this.setTileOptions.bind(this, TileType.Cleared, clearedTileClass));
    this.bindEvent(blockerTileClass, this.setTileOptions.bind(this, TileType.Blocker, blockerTileClass));
    this.bindChangeEvent(movesClass, this.setMovesOption.bind(this));
    this.bindChangeEvent(minSelectionClass, this.setMinSelectionOption.bind(this));
    this.bindChangeEvent(overlapClass, this.setToggleOnOverlapOption.bind(this));
  }

  protected update(props: {}): void {}

  private setTileOptions = (tileType: TileType, elementClass: string) => {
    this.options.tile = tileType;
    this.setTileClass(elementClass);
    this.onNewOptionsSet(this.options);
  };

  private setMovesOption = (inputEvent: any) => {
    this.options.moves = JSON.parse(inputEvent.currentTarget.value);
    this.onNewOptionsSet(this.options);
  };

  private setMinSelectionOption = (inputEvent: any) => {
    this.options.rules.minSelection = JSON.parse(inputEvent.currentTarget.value);
    this.onNewOptionsSet(this.options);
  };

  private setToggleOnOverlapOption = (inputEvent: any) => {
    this.options.rules.toggleOnOverlap = JSON.parse(inputEvent.currentTarget.value);
    this.onNewOptionsSet(this.options);
  };

  private setTileClass(elementClass: string) {
    [regularTileClass, clearedTileClass, blockerTileClass].forEach(el => {
      const classList = this.getEl(el).classList;
      elementClass === el ? classList.add("selected") : classList.remove("selected");
    });
  }
}

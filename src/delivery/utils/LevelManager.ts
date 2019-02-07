import { IGameLevel, IGameRules, IGridLayout } from "../../domain/boundaries/input";
import { IQueryStringOptions } from "./QueryStringHandler";

export default class LevelManager {
  private currentLevelIndex: number;
  private defaultRules: IGameRules = {
    toggleOnOverlap: true,
    minSelection: 1
  };

  constructor(private levels: IGameLevel[], private queryStringOptions: IQueryStringOptions) {
    this.currentLevelIndex = this.queryStringOptions.level || 0;
  }

  public get getCurrentLevelNumber() {
    return this.currentLevelIndex;
  }

  public get getCurrentLevel(): IGameLevel {
    return {
      layout: this.getLayout(),
      rules: this.getRules(),
      moves: this.getNumberOfMoves()
    };
  }

  public get canProcedeToNextLevel() {
    return !this.isLastLevel && !this.queryStringOptions.layout;
  }

  public get isLastLevel() {
    return this.currentLevelIndex === this.levels.length - 1;
  }

  public get isFirstLevel() {
    return this.currentLevelIndex === 0;
  }

  public decrementCurrentLevel() {
    if (!this.isFirstLevel) {
      this.currentLevelIndex--;
    }
  }

  public incrementCurrentLevel() {
    if (!this.isLastLevel) {
      this.currentLevelIndex++;
    }
  }

  private getLayout = (): IGridLayout => {
    return this.queryStringOptions.layout || this.levels[this.currentLevelIndex].layout;
  };

  private getRules = (): IGameRules => {
    const rules = this.levels[this.currentLevelIndex].rules || this.defaultRules;
    const { toggleOnOverlap, minSelection } = this.queryStringOptions;

    if (toggleOnOverlap !== undefined) {
      Object.assign(rules, { toggleOnOverlap });
    }
    if (minSelection !== undefined) {
      Object.assign(rules, { minSelection });
    }
    return rules;
  };

  private getNumberOfMoves = (): undefined | number => {
    if (this.queryStringOptions.layout) {
      return this.queryStringOptions.moves || undefined;
    }
    return this.levels[this.currentLevelIndex].moves;
  };
}

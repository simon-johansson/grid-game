type toggleOnOverlapType = boolean;
type minSelectionType = number;

export interface IGameRules {
  toggleOnOverlap?: toggleOnOverlapType;
  minSelection?: minSelectionType;
}

const isDefined = (rule: any) => rule !== undefined;

export default class Rules {
  public toggleOnOverlap: toggleOnOverlapType = true;
  public minSelection: minSelectionType = 1;

  constructor({ toggleOnOverlap, minSelection }: IGameRules = {}) {
    this.toggleOnOverlap = isDefined(toggleOnOverlap) ? toggleOnOverlap : this.toggleOnOverlap;
    this.minSelection = isDefined(minSelection) ? minSelection : this.minSelection;
  }
}

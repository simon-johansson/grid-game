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
    // TODO: Göra snyggare än att casta här?
    this.toggleOnOverlap = isDefined(toggleOnOverlap) ? (toggleOnOverlap as boolean) : this.toggleOnOverlap;
    this.minSelection = isDefined(minSelection) ? (minSelection as number) : this.minSelection;
  }
}

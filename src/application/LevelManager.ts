import Level from "../domain/Level";
import Rules from "../domain/Rules";
import Tile from "../domain/Tile";
import { IGameLevel, IGridLayout, ITileRawState, ITypedGridLayout, TileType } from "./interfaces";

function assertNever(state: never): never {
  throw new Error("Unkown minified tile state supplied: " + state);
}

const getTypedLayout = (layout: IGridLayout): ITypedGridLayout => {
  return layout.map(row => row.map(getTypedTile)) as ITypedGridLayout;
};

const getTypedTile = (tileMinified: ITileRawState): TileType => {
  switch (tileMinified) {
    case "r":
      return TileType.Regular;
    // TODO: Borde inte vara f för flipped
    case "f":
      return TileType.Cleared;
    case "b":
      return TileType.Blocker;
    case "2":
    case "3":
    case "4":
      throw new Error("multi flip tiles not implemented");
    default:
      return assertNever(tileMinified);
  }
};

const getMinifiedTile = (tile: Tile): ITileRawState => {
  switch (tile.tileType) {
    case TileType.Regular:
      return "r";
    case TileType.Cleared:
      return "f";
    case TileType.Blocker:
      return "b";
  }
};

export default class LevelManager {
  public static newLevel(
    level: IGameLevel,
    name?: number,
    isFirst?: boolean,
    isLast?: boolean,
    hasCompleted?: boolean,
  ): Level {
    const { layout, moves, rules: rawRules, id } = level;
    const rules = new Rules(rawRules);
    return new Level(getTypedLayout(layout), moves, rules, name, isFirst, isLast, id, hasCompleted);
  }

  public static getMinifiedLayout(tiles: Tile[]): IGridLayout {
    const layout: ITileRawState[][] = [];
    tiles.forEach(tile => {
      const { rowIndex, colIndex } = tile.position;
      layout[rowIndex] = layout[rowIndex] || [];
      layout[rowIndex][colIndex] = getMinifiedTile(tile);
    });
    return layout as IGridLayout;
  }

  constructor(
    private levels: IGameLevel[],
    private currentLevelIndex: number = 0,
    private completedLevels: string[] = [],
  ) {
    if (this.currentLevelIndex >= this.levels.length || this.currentLevelIndex < 0) {
      throw new Error("Supplied level index is out of bounds");
    }
  }

  public get getCurrentLevel(): Level {
    return this.level;
  }

  public get getNextLevel(): Level {
    if (!this.isPlayingLastLevel) {
      this.currentLevelIndex++;
      return this.level;
    } else {
      throw new Error("Can not go past last level");
    }
  }

  public get getPreviousLevel(): Level {
    if (!this.isPlayingFirstLevel) {
      this.currentLevelIndex--;
      return this.level;
    } else {
      throw new Error("Can not go below first level");
    }
  }

  public onLevelComplete(completedLevels: string[]): void {
    this.completedLevels = completedLevels;
  }

  private get level(): Level {
    const level = this.levels[this.currentLevelIndex];
    const hasCompleted = level.id ? this.hasCompleted(level.id) : false;

    return LevelManager.newLevel(
      level,
      this.currentLevelIndex,
      this.isPlayingFirstLevel,
      this.isPlayingLastLevel,
      hasCompleted,
    );
  }

  private hasCompleted(id: string): boolean {
    return this.completedLevels.indexOf(id) !== -1;
  }

  private get isPlayingLastLevel(): boolean {
    return this.currentLevelIndex === this.levels.length - 1;
  }

  private get isPlayingFirstLevel(): boolean {
    return this.currentLevelIndex === 0;
  }
}

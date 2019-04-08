import Level, { ILevelOptions } from "@domain/Level";
import Rules from "@domain/Rules";
import Tile from "@domain/Tile";
import {
  IGameLevel,
  IGridLayout,
  IOverviewData,
  IStage,
  ITileRawState,
  ITypedGridLayout,
  TileType,
} from "./interfaces";

const defaultEditorLevel: IGameLevel = {
  layout: [
    ["r", "r", "r", "r", "r"],
    ["r", "r", "r", "r", "r"],
    ["r", "r", "r", "r", "r"],
    ["r", "r", "r", "r", "r"],
    ["r", "r", "r", "r", "r"],
  ],
  rules: {
    toggleOnOverlap: true,
    minSelection: 1,
  },
  moves: 1,
};

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

const cleanLevels = (levels: IGameLevel[]) => {
  return levels.filter((level, index) => {
    // console.log(level);
    return level;
  });
};

export default class LevelManager {
  public static newLevel(level: IGameLevel, options?: ILevelOptions): Level {
    const { layout, moves, rules: rawRules, id } = level;
    return new Level(getTypedLayout(layout), moves, new Rules(rawRules), id, options);
  }

  public static newEditorLevel(level?: IGameLevel): Level {
    return level !== undefined ? LevelManager.newLevel(level) : LevelManager.newLevel(defaultEditorLevel);
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

  private currentLevelIndex: number;
  private completedLevels: string[];
  private levels: IGameLevel[];

  constructor(levels: IGameLevel[], currentLevelID: string | null = "", completedLevels: string[] | null = []) {
    this.levels = cleanLevels(levels);
    this.currentLevelIndex = this.getLevelIndexFromID(currentLevelID);
    this.completedLevels = completedLevels === null ? [] : completedLevels;
  }

  public getCurrentLevel(customLevel?: IGameLevel | string): Level {
    if (typeof customLevel === "string") this.currentLevelIndex = this.getLevelIndexFromID(customLevel);
    else if (customLevel) return this.getCustomLevel(customLevel);
    return this.level;
  }

  public get nextLevel(): Level {
    if (!this.isPlayingLastLevel) {
      this.currentLevelIndex++;
      return this.level;
    } else {
      throw new Error("Can not go past last level");
    }
  }

  public get previousLevel(): Level {
    if (!this.isPlayingFirstLevel) {
      this.currentLevelIndex--;
      return this.level;
    } else {
      throw new Error("Can not go below first level");
    }
  }

  public get overview(): IOverviewData {
    const levels = this.allLevels;
    const total = levels.length;
    const cleared = levels.filter(lvl => lvl.hasCompleted).length;
    const stages = this.getStages(levels);
    return { cleared, total, stages };
  }

  public onLevelComplete(completedLevels: string[]): void {
    this.completedLevels = completedLevels;
  }

  private getLevelIndexFromID(levelID: string | null): number {
    let levelIndex = 0;
    if (levelID !== null) {
      this.levels.forEach((lvl, index) => {
        if (lvl.id === levelID) levelIndex = index;
      });
    }
    return levelIndex;
  }

  private getCustomLevel(customLevel: IGameLevel): Level {
    console.log(JSON.stringify(customLevel));
    return LevelManager.newLevel(customLevel);
  }

  private getStages(levels: Level[]): IStage[] {
    const stageChuckSize = 25;
    const stages = [];
    for (let i = 0; i < levels.length; i += stageChuckSize) {
      stages.push(this.getStage(levels.slice(i, i + stageChuckSize)));
    }
    return stages;
  }

  private getStage(levels: Level[]): IStage {
    const isCleared = levels.every(lvl => !!lvl.hasCompleted);
    const isPlaying = levels.some(lvl => !!lvl.isCurrentlyPlaying);
    return { isCleared, isPlaying, levels };
  }

  private get level(): Level {
    const level = this.levels[this.currentLevelIndex];
    return LevelManager.newLevel(level, {
      name: this.currentLevelIndex,
      hasCompleted: this.hasCompleted(level.id),
      isCurrentlyPlaying: true,
      isFirst: this.isPlayingFirstLevel,
      isLast: this.isPlayingLastLevel,
    });
  }

  private get allLevels(): Level[] {
    return this.levels.map((lvl, i) => {
      return LevelManager.newLevel(lvl, {
        name: i + 1,
        hasCompleted: this.hasCompleted(lvl.id),
        isCurrentlyPlaying: this.currentLevelIndex === i,
      });
    });
  }

  private hasCompleted(id: string | undefined): boolean {
    return id !== undefined ? this.completedLevels.indexOf(id) !== -1 : false;
  }

  private get isPlayingLastLevel(): boolean {
    return this.currentLevelIndex === this.levels.length - 1;
  }

  private get isPlayingFirstLevel(): boolean {
    return this.currentLevelIndex === 0;
  }
}

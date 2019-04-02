import { IStorage } from "@application/interfaces";
import Level from "@domain/Level";
import localforage from "localforage";

export default class StorageIml implements IStorage {
  private currentLevelKey = "currentLevel";
  private onLevelCompleteKey = "levelComplete";

  constructor() {
    localforage.config({
      name: "GridGame",
    });
  }

  public setCurrentLevel(levelID?: string): void {
    if (levelID !== undefined) {
      localforage.setItem(this.currentLevelKey, levelID).catch(error => {
        // Analytics
        console.log(error);
      });
    }
  }

  public getCurrentLevel(): Promise<string | null> {
    return localforage.getItem<string>(this.currentLevelKey);
  }
  }

  public async onLevelComplete(levelID: string): Promise<string[]> {
    let completedLevels = await this.getCompletedLevels();
    completedLevels = completedLevels || [];
    if (completedLevels.indexOf(levelID) === -1) completedLevels.push(levelID);
    return localforage.setItem(this.onLevelCompleteKey, completedLevels);
  }

  public getCompletedLevels(): Promise<string[] | null> {
    return localforage.getItem<string[]>(this.onLevelCompleteKey);
  }

  public onFail(level: Level): void {}

  public clearAllData(): Promise<void> {
    return localforage.clear();
  }
}

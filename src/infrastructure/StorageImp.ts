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

  public setCurrentLevel(level: Level): void {
    if (level.name !== undefined) {
      localforage.setItem(this.currentLevelKey, level.name).catch(error => {
        // Analytics
        console.log(error);
      });
    }
  }

  public getCurrentLevel(): Promise<number | null> {
    return localforage.getItem<number>(this.currentLevelKey);
  }

  public async onLevelComplete(level: Level): Promise<string[]> {
    let completedLevels = await this.getCompletedLevels();
    completedLevels = completedLevels || [];
    if (completedLevels.indexOf(level.id) === -1) {
      completedLevels.push(level.id);
    }
    return localforage.setItem(this.onLevelCompleteKey, completedLevels);
  }

  public getCompletedLevels(): Promise<string[] | null> {
    return localforage.getItem<string[]>(this.onLevelCompleteKey);
  }

  public onFail(level: Level): void {}
}

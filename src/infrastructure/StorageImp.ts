import { IStorage, IUserInformation } from "@application/interfaces";
import Level from "@domain/Level";
import localforage from "localforage";

export default class StorageIml implements IStorage {
  private currentLevelKey = "currentLevel";
  private userInformationKey = "userInfo";
  private onLevelCompleteKey = "levelComplete";
  private defaultUserInformation: IUserInformation = {
    hasViewedMinSelectionInfo: false,
  };

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

  public async setUserInformation(info: Partial<IUserInformation>): Promise<IUserInformation> {
    const userInfo = await this.getUserInformation();
    return localforage.setItem(this.userInformationKey, { ...userInfo, ...info });
  }

  public async getUserInformation(): Promise<IUserInformation> {
    const data = await localforage.getItem<IUserInformation>(this.userInformationKey);
    return data || this.defaultUserInformation;
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

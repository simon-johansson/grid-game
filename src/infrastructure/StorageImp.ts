import { ISettableUserInformation, IStorage, IUserInformation } from "@application/interfaces";
import Level from "@domain/Level";
import localforage from "localforage";

export default class StorageIml implements IStorage {
  private currentLevelKey = "currentLevel";
  private userInformationKey = "userInfo";
  private onLevelCompleteKey = "levelComplete";
  private defaultUserInformation: ISettableUserInformation = {
    hasViewedMinSelectionInfo: false,
    hasViewedInstallationInfo: false,
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

  public async setUserInformation(
    info: Partial<ISettableUserInformation>,
    persisted: boolean = true,
  ): Promise<ISettableUserInformation> {
    const userInfo = await this.getUserInformation();
    if (persisted) {
      return localforage.setItem(this.userInformationKey, { ...userInfo, ...info });
    } else {
      this.defaultUserInformation = { ...this.defaultUserInformation, ...info };
      return Promise.resolve(this.defaultUserInformation);
    }
  }

  public async getUserInformation(): Promise<IUserInformation> {
    const data = await localforage.getItem<ISettableUserInformation>(this.userInformationKey);
    const cleared = (await this.getCompletedLevels()) || [];

    return { ...this.defaultUserInformation, ...data, clearedLevels: cleared.length };
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

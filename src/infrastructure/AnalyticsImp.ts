import { EGAErrorSeverity, EGAProgressionStatus, GameAnalytics } from "gameanalytics";
import packageJSON from "../../package.json";
import { IAnalytics } from "../application/interfaces";
import Level from "../domain/Level";

const GA_KEY = "87aaaa576796f5ef0df26df23fc7c0e3";
const GA_SECRET = "8e789012ed8133df1908eaff64a97d01a1cdcfa4";

const GA_DEV_KEY = "05fa73c552a901b72307566335e61ce0";
const GA_DEV_SECRET = "5383806560f5ec338170b98de5468f387bb31a60";

export default class AnalyticsIml implements IAnalytics {
  constructor() {
    GameAnalytics.configureBuild(packageJSON.version);

    // In production
    if (location.hostname === "gridgame.net") {
      GameAnalytics.initialize(GA_KEY, GA_SECRET);
    }
    // In development
    else {
      // GameAnalytics.setEnabledInfoLog(true);
      // GameAnalytics.setEnabledVerboseLog(true);
      GameAnalytics.initialize(GA_DEV_KEY, GA_DEV_SECRET);
    }
  }

  public startLevel(level: Level) {
    if (level.name !== undefined) {
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Start, level.name.toString());
    }
  }

  public onSelection(level: Level) {
    // On level complete
    if (level.isCleared && level.name) {
      GameAnalytics.addProgressionEvent(
        EGAProgressionStatus.Complete,
        level.name.toString(),
      );
    }
    // On level failed
    else if (!level.isCleared && !level.selections.left && level.name) {
      GameAnalytics.addProgressionEvent(EGAProgressionStatus.Fail, level.name.toString());
    }
  }

  public onLevelComplete(level: Level) {
    GameAnalytics.addProgressionEvent(EGAProgressionStatus.Complete, level.name.toString());
  }

  public onLevelFailed(level: Level) {
    GameAnalytics.addProgressionEvent(EGAProgressionStatus.Fail, level.name.toString());
  }

  public onError(error: string) {
    GameAnalytics.addErrorEvent(EGAErrorSeverity.Error, error);
  }
}

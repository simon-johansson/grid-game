import packageJSON from "../../package.json";
import { IAnalytics } from "../application/interfaces";
import Level from "../domain/Level";

const GA_KEY = "87aaaa576796f5ef0df26df23fc7c0e3";
const GA_SECRET = "8e789012ed8133df1908eaff64a97d01a1cdcfa4";

const GA_DEV_KEY = "05fa73c552a901b72307566335e61ce0";
const GA_DEV_SECRET = "5383806560f5ec338170b98de5468f387bb31a60";

/**
 * Needed because the gameanalytics NPM lib does not work
 * for TypeScript. Lib is in vendor folder.
 */
const gameanalytics = (window as any).gameanalytics;

export default class AnalyticsIml implements IAnalytics {
  constructor() {
    gameanalytics.GameAnalytics.configureBuild(packageJSON.version);

    // In production
    if (location.hostname === "gridgame.net") {
      gameanalytics.GameAnalytics.initialize(GA_KEY, GA_SECRET);
    }
    // In development
    else {
      // gameanalytics.GameAnalytics.setEnabledInfoLog(true);
      // gameanalytics.GameAnalytics.setEnabledVerboseLog(true);
      gameanalytics.GameAnalytics.initialize(GA_DEV_KEY, GA_DEV_SECRET);
    }
  }

  public startLevel(level: Level) {
    if (level.name !== undefined) {
      gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Start, level.name.toString());
    }
  }

  public onSelection(level: Level) {
    // On level complete
    if (level.isCleared && level.name) {
      gameanalytics.GameAnalytics.addProgressionEvent(
        gameanalytics.EGAProgressionStatus.Complete,
        level.name.toString(),
      );
    }
    // On level failed
    else if (!level.isCleared && !level.selections.left && level.name) {
      gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Fail, level.name.toString());
    }
  }

  public onLevelComplete(level: Level) {
    gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Complete, level.name.toString());
  }

  public onLevelFailed(level: Level) {
    gameanalytics.GameAnalytics.addProgressionEvent(gameanalytics.EGAProgressionStatus.Fail, level.name.toString());
  }

  public onError(error: string) {
    gameanalytics.GameAnalytics.addErrorEvent(gameanalytics.EGAErrorSeverity.Error, error);
  }
}

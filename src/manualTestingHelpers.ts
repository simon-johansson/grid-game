import Interactor from "@application/Interactor";
import StorageImp from "./infrastructure/StorageImp";

async function asyncForEach(array: any[], callback: (el: any, index: number, arr: any[]) => void): Promise<void> {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

(window as any).helperFunctions = {};

export const createHelpers = (interactor: Interactor, storage: StorageImp) => {
  (window as any).helperFunctions.clearStage = async (stage: number) => {
    const data = interactor.getOverviewData();
    const stageIndex = stage - 1;
    await asyncForEach(data.stages[stageIndex].levels, async level => {
      await storage.onLevelComplete(level.id!);
    });
    window.location.reload();
  };

  (window as any).helperFunctions.almostClearStage = async (stage: number) => {
    const data = interactor.getOverviewData();
    const stageIndex = stage - 1;
    const len = data.stages[stageIndex].levels.length;
    const randIndex = Math.floor(Math.random() * len);
    await asyncForEach(data.stages[stage - 1].levels, async (level, index) => {
      if (index !== randIndex) await storage.onLevelComplete(level.id!);
    });
    window.location.reload();
  };

  (window as any).helperFunctions.clearStorage = async () => {
    await storage.clearAllData();
    window.location.reload();
  };
};

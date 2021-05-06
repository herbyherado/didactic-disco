import {ChoreService} from "./use-case/ChoreService";
import {InMemoryChoreService} from "./application/InMemoryChoreService";

const choreServiceImpl = new InMemoryChoreService();

export class DiContainer {
  constructor(public readonly choreService: ChoreService) {}

  private static instance: DiContainer = new DiContainer(choreServiceImpl);

  public static getInstance(): DiContainer {
    return this.instance;
  }
}

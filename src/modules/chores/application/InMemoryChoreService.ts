import {BehaviorSubject, Observable} from "rxjs";
import {Chore} from "../domain/Chore";
import {ChoreService, ChoreInput} from "../use-case/ChoreService";

import mockData from "./data.json";

export class InMemoryChoreService implements ChoreService {
  public readonly subject = new BehaviorSubject<Chore[] | undefined>(undefined);

  private async refresh() {
    // some mock call to db
    await new Promise((res) => setTimeout(res, 300));
    const result = mockData;
    this.subject.next(result);
  }

  private generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  public observeChores(): Observable<Chore[]> {
    if (!this.subject.value) {
      this.refresh().finally();
    }
    return this.subject;
  }

  public async getAll(): Promise<Chore[]> {
    this.refresh().finally();
    return this.subject.value;
  }

  public async getById(choreId: string): Promise<Chore> {
    if (!this.subject.value) {
      this.refresh().finally();
    }
    return this.subject.value.find((chore) => chore.id === choreId);
  }

  public async deleteChore(choreId: string): Promise<void> {
    const chores = this.subject.value.filter((chore) => chore.id !== choreId);
    await this.subject.next(chores);
    return;
  }

  public async addChore({description, assigneeId}: ChoreInput): Promise<void> {
    const id = this.generateId();
    const chores = [...this.subject.value, {id, description, dueDate: "", assignee: assigneeId}];
    await this.subject.next(chores);
    return;
  }
}

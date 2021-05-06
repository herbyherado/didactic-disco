import {Observable} from "rxjs";
import {Chore} from "../domain/Chore";

export interface ChoreInput {
  description: string;
  assigneeId: string;
}

export interface ChoreService {
  observeChores: () => Observable<Chore[]>;
  getAll: () => Promise<Chore[]>;
  getById: (choreId: string) => Promise<Chore>;
  addChore: (input: ChoreInput) => Promise<void>;
  deleteChore: (choreId: string) => Promise<void>;
}

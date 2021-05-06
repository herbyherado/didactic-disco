import {Member} from "../domain/Member";

export interface MemberService {
  getById: (profileId: string) => Promise<Member>;
  getAll: () => Promise<Member[]>;
}

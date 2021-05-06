import {Member} from "../domain/Member";
import {MemberService} from "../use-case/MemberService";

import mockData from "./data.json";

export class InMemoryMemberService implements MemberService {
  public async getById(memberId: string): Promise<Member> {
    // some mock call to db
    await new Promise((res) => setTimeout(res, 300));
    const result = mockData.find((member) => member.id === memberId);

    return result;
  }

  public async getAll(): Promise<Member[]> {
    // some mock call to db
    await new Promise((res) => setTimeout(res, 300));
    return mockData;
  }
}

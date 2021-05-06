import {MemberService} from "./use-case/MemberService";
import {InMemoryMemberService} from "./application/InMemoryMemberService";

const memberServiceImpl = new InMemoryMemberService();

export class DiContainer {
  constructor(public readonly memberService: MemberService) {}

  private static instance: DiContainer = new DiContainer(memberServiceImpl);

  public static getInstance(): DiContainer {
    return this.instance;
  }
}

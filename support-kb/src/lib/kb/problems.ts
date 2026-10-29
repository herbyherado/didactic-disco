// The problems a merged ticket really holds, each with the ticket that now tracks it.
// causes.ts says which bug a tenant's report can reach; this adds what the desk read in the report itself.
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

// `shift`: the date moves by one day, or differs between attendees in different time zones.
// No month and day swap: a different bug from both causes, whatever the tenant's locale or form.
export type Problem = Cause | 'shift';
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'shift'];

// One ticket per problem, in the desk's tracker.
const TRACKER = 'https://github.com/herbyherado/didactic-disco/issues';
export const TICKET: Record<Problem, { number: number; href: string }> = {
  parser: { number: 1, href: `${TRACKER}/1` },
  hint: { number: 2, href: `${TRACKER}/2` },
  shift: { number: 3, href: `${TRACKER}/3` },
};

// The desk's reading of a report (desk-notes.json) wins over where its tenant would place it.
export function problemOf(r: Report, t: Tenant | undefined, oneDayMove: readonly string[]): Problem | null {
  return oneDayMove.includes(r.id) ? 'shift' : causeOf(r, t);
}

export type ProblemGroup = {
  problem: Problem | 'unplaced';
  reports: Report[];
  tenants: string[];
  channels: Record<string, number>;
  subjects: Set<string>;
  firstSeen: string;
  lastSeen: string;
};

export function groupByProblem(
  reports: Report[],
  tenantOf: (r: Report) => Tenant | undefined,
  oneDayMove: readonly string[],
): ProblemGroup[] {
  const by = new Map<ProblemGroup['problem'], Report[]>();
  for (const r of uniqueById(reports)) {
    const p = problemOf(r, tenantOf(r), oneDayMove) ?? 'unplaced';
    by.set(p, [...(by.get(p) ?? []), r]);
  }
  return [...by.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: [...new Set(rs.map((r) => r.tenant))].sort(),
        channels: rs.reduce<Record<string, number>>((n, r) => ({ ...n, [r.channel]: (n[r.channel] ?? 0) + 1 }), {}),
        subjects: new Set(rs.map((r) => r.subject)),
        firstSeen: days[0],
        lastSeen: days[days.length - 1],
      };
    })
    .sort((a, b) => b.reports.length - a.reports.length);
}

// Subject lines that turn up under more than one problem: matching on them cannot keep the problems apart.
export function sharedSubjects(groups: ProblemGroup[]): string[] {
  const seen = new Map<string, number>();
  for (const g of groups) for (const s of g.subjects) seen.set(s, (seen.get(s) ?? 0) + 1);
  return [...seen].filter(([, n]) => n > 1).map(([s]) => s).sort();
}

// Reports where intake's tag (from the browser) names a different cause than the tenant does.
export function mistagged(g: ProblemGroup): number {
  return g.problem === 'parser' || g.problem === 'hint' ? g.reports.filter((r) => r.meta.intakeTag !== g.problem).length : 0;
}

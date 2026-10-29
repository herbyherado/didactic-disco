<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import notes from '#lib/data/desk-notes.json';
  import { uniqueById, type Report } from '#lib/kb/causes';
  import { groupByProblem, mistagged, sharedSubjects, TICKET } from '#lib/kb/problems';
  import { tenantOf } from '#lib/kb/locales';

  // `list`: print the report ids of any problem this small or smaller.
  let { ticket, list = 10 }: { ticket: number; list?: number } = $props();

  const merged = $derived(uniqueById(reports as Report[]).filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByProblem(merged, tenantOf, notes.oneDayMove));
  const shared = $derived(sharedSubjects(groups));
  const channels = (c: Record<string, number>) =>
    Object.entries(c)
      .sort((a, b) => b[1] - a[1])
      .map(([ch, n]) => `${ch} ×${n}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{merged.length}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'} ·
  <strong>{groups.filter((g) => g.problem !== 'unplaced').length}</strong> tickets
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>ticket</th><th>tenants</th><th>came in by</th><th>seen</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      <tr class:unplaced={g.problem === 'unplaced'}>
        <td><code>{g.problem}</code></td>
        <td>{g.reports.length}</td>
        <td>
          {#if g.problem === 'unplaced'}no ticket: read these by hand{:else}<a href={TICKET[g.problem].href}>#{TICKET[g.problem].number}</a>{/if}
        </td>
        <td>{g.tenants.length}</td>
        <td class="muted">{channels(g.channels)}</td>
        <td>{g.firstSeen} → {g.lastSeen}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#each groups as g (g.problem)}
  {@const wrong = mistagged(g)}
  {#if wrong}
    <p class="muted"><code>{g.problem}</code>: intake tagged {wrong} of {g.reports.length} as something else.</p>
  {/if}
  {#if g.reports.length <= list}
    <p class="muted"><code>{g.problem}</code>: {g.reports.map((r) => r.id).join(', ')} · {g.tenants.join(', ')}</p>
  {/if}
{/each}

<p class="muted">
  {shared.length} of {new Set(merged.map((r) => r.subject)).size} subject lines turn up under more than one problem{shared.length ? `: ${shared.map((s) => `“${s}”`).join(', ')}` : ''}.
</p>

<style>
  .sum { font-size: 1.1rem; }
  .muted { color: var(--muted); font-size: 0.85em; }
  .unplaced td { background: var(--warn-bg); color: var(--warn); }
</style>

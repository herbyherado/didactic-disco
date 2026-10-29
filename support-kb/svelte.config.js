// Build harness for rendering the kb as the desk sees it (not part of the export).
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: 'src/lib/layouts/runbook.svelte' } })],
  kit: {
    adapter: adapter({ pages: 'build', fallback: undefined }),
    alias: { '#lib': 'src/lib' },
    prerender: { entries: ['*'] },
  },
};

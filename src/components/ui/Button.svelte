<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    variant?: 'primary' | 'surface';
    class?: string;
    children: Snippet;
  }

  let { href = '#', variant = 'primary', class: className = '', children }: Props = $props();
</script>

{#if variant === 'primary'}
  <a
    {href}
    class="inline-flex items-center gap-1 btn-fill btn-fill-primary px-4 py-2 border-thin border-accent rounded-lg font-medium text-primary hover:text-emerald-950 text-base uppercase tracking-widest btn-fill {className}"
  >
    {@render children()}
  </a>
{:else}
  <a
    {href}
    class="block z-10 btn-fill btn-fill-surface px-4 py-2 border-thin border-transparent rounded-lg font-medium text-text-primary hover:text-white text-base uppercase tracking-widest btn-fill {className}"
  >
    {@render children()}
  </a>
{/if}
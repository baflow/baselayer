<script lang="ts">
  interface Props {
    label: string;
    date?: Date;
    readTime?: string;
    variant?: 'default' | 'highlight';
    class?: string;
  }

  let {
    label,
    date,
    readTime,
    variant = 'default',
    class: className = '',
  }: Props = $props();

  const fmtDate = date
    ? date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).toUpperCase()
    : undefined;
</script>

<div
  class="flex items-center justify-between font-sans text-primary uppercase tracking-widest border-b border-border/30 pb-2 {className}"
>
  <div class="flex items-center gap-2">
    {#if variant === 'highlight'}
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
    {/if}
    <span class="subtitles text-sm font-medium">{label}</span>
  </div>
  <div class="flex items-center gap-3 text-text-primary/60 text-xs">
    {#if fmtDate}
      <span>{fmtDate}</span>
    {/if}
    {#if fmtDate && readTime}
      <span class="w-1 h-1 rounded-full bg-text-primary/40"></span>
    {/if}
    {#if readTime}
      <span>{readTime}</span>
    {/if}
  </div>
</div>

<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import lottie from 'lottie-web';

  interface Props {
    src: string;
    loop?: boolean;
    autoplay?: boolean;
    renderer?: 'svg' | 'canvas' | 'html';
    class?: string;
  }

  let {
    src,
    loop = true,
    autoplay = true,
    renderer = 'svg',
    class: className = '',
  }: Props = $props();

  let containerEl: HTMLDivElement;
  let anim: ReturnType<typeof lottie.loadAnimation> | null = null;

  onMount(async () => {
    if (!containerEl) return;

    try {
      const res = await fetch(src);
      const animationData = await res.json();

      anim = lottie.loadAnimation({
        container: containerEl,
        renderer,
        loop,
        autoplay,
        animationData,
      });
    } catch (err) {
      console.error('Lottie load failed:', err);
    }
  });

  onDestroy(() => {
    anim?.destroy();
  });
</script>

<div
  bind:this={containerEl}
  class="w-full aspect-square rounded-xl relative overflow-hidden {className}"
></div>

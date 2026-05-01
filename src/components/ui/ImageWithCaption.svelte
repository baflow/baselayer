<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    caption?: string;
    class?: string;
  }

  let { src, alt, caption, class: className = '' }: Props = $props();
</script>

<figure class="w-full {className}">
  <div
    class="p-[6px] rounded-[18px] bg-gradient-to-b from-white/[0.08] to-white/[0.01] border border-border/20 relative group"
  >
    <!-- ambient glow on hover -->
    <div
      class="absolute inset-0 bg-tertiary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[18px]"
    ></div>

    <div class="rounded-xl overflow-hidden bg-surface relative z-10 border border-white/5">
      <img
        {src}
        {alt}
        class="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
        loading="lazy"
      />
    </div>

    <!-- decorative corners -->
    <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50 z-20 m-3"></div>
    <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50 z-20 m-3"></div>
    <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50 z-20 m-3"></div>
    <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50 z-20 m-3"></div>
  </div>
  {#if caption}
    <figcaption class="font-sans text-xs uppercase tracking-widest text-text-primary/60 text-center mt-4">
      {caption}
    </figcaption>
  {/if}
</figure>

<script lang="ts">
    import type { Snippet } from "svelte";
    import Canvas3D from "./Canvas3D.svelte";

    interface Props {
        subtitle?: string;
        heading?: string;
        headingItalic?: string;
        headingHighlight?: string;
        description?: string;
        descriptionSecondary?: string;
        labHref?: string;
        blogHref?: string;
        /** Show the 3D canvas column */
        showCanvas?: boolean;
    }

    let {
        subtitle = "Personal Node",
        heading = "Full-stack engineer building",
        headingItalic = "efficent, secure systems",
        headingHighlight = "digital aesthetics",
        description = "Hi, I'm a developer specializing in systems architecture and minimalist UI engineering. This space serves as my personal laboratory and digital garden.",
        descriptionSecondary = "Welcome to a repository of my modular research, technical documentation, and experiments in digital craft.",
        labHref = "/lab",
        blogHref = "/blog",
        showCanvas = true,
    }: Props = $props();
</script>

<section class="relative py-12 overflow-hidden">
    <div
        class="items-center gap-8 grid grid-cols-1 lg:grid-cols-2 mx-auto px-6 max-w-6xl"
    >
        <!-- Left: content -->
        <div class="max-w-xl">
            <span
                class="block mb-2 font-[525] font-sans text-primary uppercase subtitles"
            >
                {subtitle}
            </span>
            <h1 class="mb-4 font-[350] leading-9">
                {heading}
                <span class="font-light italic">{headingItalic}</span>
                and exploring
                <span class="text-primary">{headingHighlight}</span>.
            </h1>
            <div class="space-y-4 tracking-[0.013em]">
                <p class="text-text-primary text-xl text-pretty leading-5">
                    {description}
                </p>
                <p class="text-text-primary/80 tracking-wide">
                    {descriptionSecondary}
                </p>
            </div>
            <div class="flex gap-2 mt-8">
                <a
                    href={labHref}
                    class="inline-flex items-center gap-1 btn-fill-primary px-4 py-2 border border-accent rounded-lg font-semibold hover:font-extrabold text-primary hover:text-emerald-950 text-base uppercase tracking-widest btn-fill btn-fill"
                >
                    View Lab
                    <span>
                        <svg
                            class="fill-emerald-200 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 256 256"
                        >
                            <path
                                d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z"
                            ></path>
                        </svg>
                    </span>
                </a>
                <a
                    href={blogHref}
                    class="block z-10 btn-fill-surface px-4 py-2 border border-transparent rounded-lg font-medium text-text-primary hover:text-white text-base uppercase tracking-widest btn-fill btn-fill"
                >
                    Read Log
                </a>
            </div>
        </div>

        <!-- Right: Three.js canvas -->
        {#if showCanvas}
            <div class="hidden lg:block">
                <Canvas3D />
            </div>
        {/if}
    </div>
</section>

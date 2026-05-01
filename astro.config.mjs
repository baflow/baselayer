// @ts-check

import mdx from '@astrojs/mdx';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [svelte(), mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss()],
	},
	fonts: [
		{
			provider: fontProviders.fontsource(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['sans-serif'],
			weights: ['100 900'],
			styles: ['normal'],
			subsets: ['latin'],
		},
		{
			provider: fontProviders.google(),
			name: 'Newsreader',
			cssVariable: '--font-newsreader',
			fallbacks: ['serif'],
			weights: ['200 800'],
			styles: ['normal', 'italic'],
			subsets: ['latin'],
		},
	],
});

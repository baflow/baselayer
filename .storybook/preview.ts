import '../src/styles/global.css';
import type { Preview } from '@storybook/svelte';

/* Font fallback variables — Astro <Font /> injects these in the app */
const style = document.createElement('style');
style.textContent = `
  :root {
    --font-inter: 'Inter', ui-sans-serif, system-ui, sans-serif;
    --font-newsreader: 'Newsreader', ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  }
`;
document.head.appendChild(style);

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        project: { name: 'project', value: '#0B0F0D' },
        light: { name: 'light', value: '#ffffff' },
        surface: { name: 'surface', value: '#0B1E18' }
      }
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: 'project'
    }
  }
};

export default preview;
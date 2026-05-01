<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Button from './Button.svelte';

  const { Story } = defineMeta({
    title: 'UI/Button',
    component: Button,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Primary" args={{ variant: 'primary', href: '/lab' }}>
  View Lab →
</Story>

<Story name="Surface" args={{ variant: 'surface', href: '/blog' }}>
  Read Log
</Story>
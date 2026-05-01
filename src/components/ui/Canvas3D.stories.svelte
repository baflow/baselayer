<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Canvas3D from './Canvas3D.svelte';

  const { Story } = defineMeta({
    title: 'UI/Canvas3D',
    component: Canvas3D,
    parameters: {
      layout: 'centered',
    },
  });
</script>

<Story name="Default" />

<Story
  name="Slow Pulse"
  args={{
    pulseSpeed: 8,
    pulseAmplitude: 0.25,
  }}
/>

<Story
  name="High Sensitivity"
  args={{
    driftSensitivity: 0.6,
  }}
/>
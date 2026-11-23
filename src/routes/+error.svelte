<script lang="ts">
  import { page } from '$app/state';
  import ErrorState from '#lib/views/ErrorState.svelte';
</script>

<svelte:head>
  <title>{page.status} — Hopnote</title>
</svelte:head>

<ErrorState
  status={page.status}
  message={page.error?.message ||
    (page.status === 404
      ? "The page you're looking for isn't on the board."
      : 'Something went wrong while serving this page.')}
  onReset={() => window.location.assign('/')}
/>

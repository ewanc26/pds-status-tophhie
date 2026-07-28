<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tophhie Social Server Status</title>
	<meta
		name="description"
		content="Live status, version, account list and storage usage for the tophhie.social AT Protocol PDS."
	/>
</svelte:head>

{@render children()}

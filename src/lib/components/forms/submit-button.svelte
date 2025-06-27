<script lang="ts">
	import { Button } from '$lib/components/ui/form';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { Snippet } from 'svelte';
	import type { Readable } from 'svelte/store';

	let { submitting, children }: { submitting: Readable<boolean>; children: Snippet } = $props();
</script>

<Button type="submit">
	{#if $submitting}
		<LoaderCircle class="animate-spin" />
	{/if}
	{@render children()}
</Button>

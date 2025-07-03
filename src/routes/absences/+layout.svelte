<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Tabs.Root value={page.url.pathname} class="mb-5">
	<Tabs.List class="grid w-full grid-cols-2">
		<Tabs.Trigger class="w-full" value="/absences/plan" onclick={() => goto('/absences/plan')}>
			Geplante Tage
		</Tabs.Trigger>
		<Tabs.Trigger
			class="w-full"
			value="/absences/entries"
			onclick={() => goto('/absences/entries')}
		>
			Einträge
		</Tabs.Trigger>
	</Tabs.List>
</Tabs.Root>

{@render children()}

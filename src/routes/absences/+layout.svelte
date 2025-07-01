<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import * as Tabs from '$lib/components/ui/tabs';
	import { page } from '$app/state';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<Tabs.Root value={page.url.pathname} class="mb-5">
	<Tabs.List class="grid w-full grid-cols-2">
		<form method="get" action="/absences/plan">
			<Tabs.Trigger class="w-full" type="submit" value="/absences/plan">Geplante Tage</Tabs.Trigger>
		</form>
		<form method="get" action="/absences/entries">
			<Tabs.Trigger class="w-full" formmethod="GET" type="submit" value="/absences/entries">
				Einträge
			</Tabs.Trigger>
		</form>
	</Tabs.List>
</Tabs.Root>

{@render children()}

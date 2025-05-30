<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Target, TargetEntry } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import LocalDateComponent from './LocalDateComponent.svelte';

	let { targetEntries }: { targetEntries: TargetEntry[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Start</Table.Head>
			<Table.Head>Ende</Table.Head>
			<Table.Head>Leistung</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each targetEntries as entry (entry)}
			<Table.Row>
				<Table.Cell>
					<LocalDateComponent date={entry.startDate} />
				</Table.Cell>
				<Table.Cell>
					<LocalDateComponent date={entry.endDate} />
				</Table.Cell>
				<Table.Cell>{entry.entryValue}</Table.Cell>
				<Table.Cell>
					
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

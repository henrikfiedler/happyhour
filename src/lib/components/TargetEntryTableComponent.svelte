<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Target, TargetEntry } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import LocalDateComponent from './LocalDateComponent.svelte';
	import { Skeleton } from './ui/skeleton';
	import { enhance } from '$app/forms';

	let { targetEntries }: { targetEntries: Promise<TargetEntry[]> } = $props();
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
		{#await targetEntries}
			<Table.Row>
				{#each Array(4) as i}
					<Table.Cell>
						<Skeleton class="h-5 w-full"></Skeleton>
					</Table.Cell>
				{/each}
			</Table.Row>
		{:then entries}
			{#each entries as entry (entry)}
				<Table.Row>
					<Table.Cell>
						<LocalDateComponent date={entry.startDate} />
					</Table.Cell>
					<Table.Cell>
						{#if entry.endDate}
							<LocalDateComponent date={entry.endDate} />
						{/if}
					</Table.Cell>
					<Table.Cell>{entry.entryValue}</Table.Cell>
					<Table.Cell>
						<form action="?/delete" method="post" use:enhance>
							<Button type="submit" name="targetEntryId" value={entry.id} variant="destructive">
								Löschen
							</Button>
						</form>
					</Table.Cell>
				</Table.Row>
			{/each}
		{/await}
	</Table.Body>
	<Table.Footer>
		<Table.Row>
			{#await targetEntries}
				<Table.Cell colspan={2}>
					<Skeleton class="h-5 w-full"></Skeleton>
				</Table.Cell>
				<Table.Cell>
					<Skeleton class="h-5 w-full"></Skeleton>
				</Table.Cell>
			{:then entries}
				<Table.Cell colspan={2}>Total</Table.Cell>
				<Table.Cell>
					{entries.reduce((total, entry) => total + entry.entryValue, 0)}
				</Table.Cell>
				<Table.Cell></Table.Cell>
			{/await}
		</Table.Row>
	</Table.Footer>
</Table.Root>

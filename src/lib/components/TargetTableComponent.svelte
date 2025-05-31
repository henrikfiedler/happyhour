<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Target } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import LocalDateComponent from './LocalDateComponent.svelte';

	let { targets }: { targets: Target[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Start</Table.Head>
			<Table.Head>Ende</Table.Head>
			<Table.Head>Zielwert</Table.Head>
			<Table.Head></Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each targets as target (target)}
			<Table.Row>
				<Table.Cell>
					<LocalDateComponent date={target.startDate} />
				</Table.Cell>
				<Table.Cell>
					<LocalDateComponent date={target.endDate} />
				</Table.Cell>
				<Table.Cell>{target.targetValue}</Table.Cell>
				<Table.Cell>
					<Button href="targets/{target.id}">Detail</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

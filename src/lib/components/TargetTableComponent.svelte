<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { Target, User } from '$lib/types';
	import { Button } from '$lib/components/ui/button';
	import LocalDateComponent from './local-date-component.svelte';
	import { enhance } from '$app/forms';
	import Star from '@lucide/svelte/icons/star';

	let {
		targets,
		favoriteTargetId
	}: { targets: Target[]; favoriteTargetId: User['favoriteTargetId'] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head></Table.Head>
			<Table.Head>Bezeichnung</Table.Head>
			<Table.Head class="hidden sm:table-cell">Start</Table.Head>
			<Table.Head class="hidden sm:table-cell">Ende</Table.Head>
			<Table.Head class="hidden sm:table-cell">Zielwert</Table.Head>
			<Table.Head></Table.Head>
			<!-- <Table.Head></Table.Head> -->
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each targets as target (target)}
			<Table.Row>
				<Table.Cell>
					<form action="/targets?/favorite" method="POST" use:enhance>
						<input type="hidden" name="targetId" value={target.id} />
						<Button type="submit" variant="ghost" name="targetId" size="icon">
							{#if target.id === favoriteTargetId}
								<span class="sr-only">Favorit entfernen</span>
								<span class="text-yellow-400">
									<Star fill="yellow" />
								</span>
							{:else}
								<span class="sr-only">Favorit aktualisieren</span>
								<span class="text-muted-foreground">
									<Star />
								</span>
							{/if}
						</Button>
					</form>
				</Table.Cell>
				<Table.Cell>
					{target.description}
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					<LocalDateComponent date={target.startDate} />
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					<LocalDateComponent date={target.endDate} />
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">{target.targetValue.toLocaleString()}</Table.Cell>
				<Table.Cell>
					<Button href={`/targets/${target.id}`} variant="outline" size="icon">
						<span class="sr-only">Einträge anzeigen</span>
						<span class="text-muted-foreground"> &gt; </span>
					</Button>
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

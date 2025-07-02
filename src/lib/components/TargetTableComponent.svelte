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
			<Table.Head>Start</Table.Head>
			<Table.Head>Ende</Table.Head>
			<Table.Head>Zielwert</Table.Head>
			<Table.Head></Table.Head>
			<!-- <Table.Head></Table.Head> -->
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each targets as target (target)}
			<Table.Row class="relative">
				<Table.Cell class="relative z-20">
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
				<Table.Cell>
					<LocalDateComponent date={target.startDate} />
				</Table.Cell>
				<Table.Cell>
					<LocalDateComponent date={target.endDate} />
				</Table.Cell>
				<Table.Cell>{target.targetValue.toLocaleString()}</Table.Cell>
				<Table.Cell class="px-2">
					<span class="text-muted-foreground"> &gt; </span>
				</Table.Cell>
				<a href={`targets/${target.id}`} class="absolute inset-0 z-10"></a>
				<!-- <Table.Cell>
					<Button href="targets/{target.id}">Detail</Button>
				</Table.Cell> -->
				<!-- <Table.Cell>
					<form action="/targets?/delete" method="post" use:enhance>
						<Button type="submit" name="targetId" value={target.id} variant="destructive">
							Löschen
						</Button>
					</form>
				</Table.Cell> -->
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

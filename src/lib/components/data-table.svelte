<script lang="ts" generics="T extends {id: string }">
	import * as Table from '$lib/components/ui/table';
	import type { ColumnDef, RowData } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderSnippet, renderComponent } from './ui/data-table';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	interface Props {
		table: ReturnType<typeof createSvelteTable<T>>;
		columns: ColumnDef<T>[];
		withDeleteDialog?: boolean;
	}

	let { table, columns, withDeleteDialog }: Props = $props();

	let dialogOpen = $state(false);
	let deleteSubmitting = $state(false);
</script>

{#if withDeleteDialog}
	<Button
		class="mb-2"
		variant="destructive"
		onclick={() => (dialogOpen = !dialogOpen)}
		disabled={!table.getSelectedRowModel().rows.length}
	>
		Ausgewählte Löschen
	</Button>

	<Dialog.Root bind:open={dialogOpen}>
		<!-- <Dialog.Trigger>Open</Dialog.Trigger> -->
		<Dialog.Content>
			<form
				action="?/deleteSelected"
				method="post"
				use:enhance={() => {
					deleteSubmitting = true;
					return async ({ update, result }) => {
						await update();
						if (result.type === 'success') {
							table.setRowSelection({}); // clear selected rows
							dialogOpen = false;
							deleteSubmitting = false;
						}
					};
				}}
			>
				<Dialog.Header>
					<Dialog.Title>Einträge wirklich löschen?</Dialog.Title>
					<Dialog.Description />
				</Dialog.Header>
				<p>
					{table.getSelectedRowModel().rows.length} Einträge werden gelöscht.
				</p>
				{#each table.getSelectedRowModel().rows as row (row.id)}
					<input type="hidden" name="targetEntryId" value={row.original.id} />
				{/each}
				<Dialog.Footer>
					<Button type="submit" variant="destructive" disabled={deleteSubmitting}>
						{#if deleteSubmitting}
							<LoaderCircle class="animate-spin" />
						{/if}
						Löschen
					</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}

<Table.Root>
	<Table.Header>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<Table.Row>
				{#each headerGroup.headers as header (header.id)}
					<Table.Head>
						{#if !header.isPlaceholder}
							<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
						{/if}
					</Table.Head>
				{/each}
			</Table.Row>
		{/each}
	</Table.Header>
	<Table.Body>
		{#each table.getRowModel().rows as row (row.id)}
			<Table.Row data-state={row.getIsSelected() && 'selected'}>
				{#each row.getVisibleCells() as cell (cell.id)}
					<Table.Cell>
						<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
					</Table.Cell>
				{/each}
			</Table.Row>
		{:else}
			<Table.Row>
				<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
	<!-- <Table.Footer></Table.Footer> -->
</Table.Root>

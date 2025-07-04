<script lang="ts">
	import type { TargetEntry } from '$lib/types';
	import LocalDateComponent from './local-date-component.svelte';
	import { getCoreRowModel, type ColumnDef, type RowSelectionState } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderSnippet, renderComponent } from './ui/data-table';
	import { Checkbox } from './ui/checkbox';
	import DataTable from './data-table.svelte';

	let {
		targetEntries: data,
		withDeleteDialog
	}: { targetEntries: TargetEntry[]; withDeleteDialog: boolean } = $props();

	let rowSelection = $state<RowSelectionState>({});

	const columns: ColumnDef<TargetEntry>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'startDate',
			header: 'Start',
			cell: ({ row }) => {
				return renderComponent(LocalDateComponent, { date: new Date(row.getValue('startDate')) });
			}
		},
		{
			accessorKey: 'endDate',
			header: 'Ende',
			cell: ({ row }) => {
				return row.getValue('endDate')
					? renderComponent(LocalDateComponent, { date: new Date(row.getValue('endDate')) })
					: '';
			}
		},
		{
			accessorKey: 'entryValue',
			header: 'Leistung',
			cell: ({ row }) => {
				const value = row.getValue('entryValue') as number;
				return value.toLocaleString()
			}
		}
	];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get rowSelection() {
				return rowSelection;
			}
		}
	});
</script>

<DataTable {table} {columns} {withDeleteDialog}></DataTable>

<!-- <Button
	class="mb-2"
	variant="destructive"
	onclick={() => (dialogOpen = !dialogOpen)}
	disabled={!table.getSelectedRowModel().rows.length}
>
	Ausgewählte Löschen
</Button>

<Dialog.Root bind:open={dialogOpen}>
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
</Dialog.Root> -->

<!-- <Table.Root>
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
</Table.Root> -->

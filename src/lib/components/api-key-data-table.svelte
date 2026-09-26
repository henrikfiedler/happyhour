<script lang="ts">
	import type { ApiKey } from '$lib/types';
	import LocalDateComponent from './local-date-component.svelte';
	import { getCoreRowModel, type ColumnDef, type RowSelectionState } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from './ui/data-table';
	import { Checkbox } from './ui/checkbox';
	import DataTable from './data-table.svelte';

	let { apiKeys: data }: { apiKeys: ApiKey[] } = $props();

	let rowSelection = $state<RowSelectionState>({});

	const columns: ColumnDef<ApiKey>[] = [
		{
			id: 'select',
			header: ({ table }) => renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Alle API-Keys auswählen'
			}),
			cell: ({ row }) => renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value) => row.toggleSelected(!!value),
				'aria-label': 'API-Key auswählen'
			}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'name',
			header: 'Bezeichnung'
		},
		{
			accessorKey: 'keyPrefix',
			header: 'Präfix',
			cell: ({ row }) => `${row.getValue('keyPrefix')}…`
		},
		{
			accessorKey: 'createdAt',
			header: 'Erstellt',
			cell: ({ row }) => renderComponent(LocalDateComponent, {
				date: new Date(row.getValue('createdAt'))
			})
		}
	];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: (updater) => {
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		state: {
			get rowSelection() {
				return rowSelection;
			}
		}
	});
</script>

<DataTable
	{table}
	{columns}
	withDeleteDialog={true}
	deleteAction="?/revokeSelected"
	deleteButtonLabel="Ausgewählte verwerfen"
	deleteDialogTitle="API-Keys wirklich verwerfen?"
	deleteItemLabel="API-Keys werden verworfen und können danach nicht mehr verwendet werden."
/>

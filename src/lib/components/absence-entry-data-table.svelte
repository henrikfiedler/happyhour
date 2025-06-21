<script lang="ts">
	import type { AbsenceEntry } from '$lib/types';
	import LocalDateComponent from './local-date-component.svelte';
	import { getCoreRowModel, type ColumnDef, type RowSelectionState } from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderSnippet, renderComponent } from './ui/data-table';
	import { Checkbox } from './ui/checkbox';
	import DataTable from './data-table.svelte';

	let { absenceEntries: data }: { absenceEntries: AbsenceEntry[] } = $props();

	let rowSelection = $state<RowSelectionState>({});

	const columns: ColumnDef<AbsenceEntry>[] = [
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
			accessorKey: 'type',
			header: 'Type',
			cell: ({ row }) => {
				const type: AbsenceEntry['type'] = row.getValue('type');
				switch (type) {
					case 'vacation':
						return 'Urlaub';
					case 'sick':
						return 'Krank';
					case 'misc':
						return 'Sonstiges';
					default:
						return 'Sonstiges';
				}
			}
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
			accessorKey: 'description',
			header: 'Beschreibung'
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

<DataTable {table} {columns} withDeleteDialog={true}></DataTable>

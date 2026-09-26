<script lang="ts">
	import type { Workday } from '$lib/types';
	import LocalDateComponent from './local-date-component.svelte';
	import { getCoreRowModel, type ColumnDef, type RowSelectionState } from '@tanstack/table-core';
	import { createSvelteTable, renderComponent } from './ui/data-table';
	import { Checkbox } from './ui/checkbox';
	import DataTable from './data-table.svelte';
	import { workdayTypesArray } from '$lib/types';

	let { workdays: data }: { workdays: Workday[] } = $props();

	let rowSelection = $state<RowSelectionState>({});

	const columns: ColumnDef<Workday>[] = [
		{
			id: 'select',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table.getIsAllPageRowsSelected(),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
					'aria-label': 'Alle Arbeitstage auswählen'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(!!value),
					'aria-label': 'Arbeitstag auswählen'
				}),
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: 'date',
			header: 'Datum',
			cell: ({ row }) =>
				renderComponent(LocalDateComponent, { date: new Date(row.getValue('date')) })
		},
		{
			accessorKey: 'type',
			header: 'Arbeitsort',
			cell: ({ row }) => {
				const type = row.getValue('type') as Workday['type'];
				return workdayTypesArray.find((workday) => workday.value === type)?.label ?? type;
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
			rowSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
		},
		state: {
			get rowSelection() {
				return rowSelection;
			}
		}
	});
</script>

<DataTable {table} {columns} withDeleteDialog={true} />

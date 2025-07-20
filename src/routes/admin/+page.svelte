<script lang="ts">
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import type { PageData } from './$types';
	import AdminUserLineChart from './components/admin-user-line-chart.svelte';
	import AdminUserTable from './components/admin-user-table.svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="grid grid-cols-1 gap-5">
	<h1 class="text-4xl font-bold">User</h1>
	<div>
		<p>
			Registriert: {data.users.length}
		</p>
		<p>
			Letzte Registrierung: <LocalDateComponent
				date={new Date(Math.max(...data.users.map((u) => new Date(u.createdAt).getTime())))}
			></LocalDateComponent>
		</p>
	</div>

	<AdminUserLineChart chartData={data.cumulativeUserCounts}></AdminUserLineChart>

	<AdminUserTable users={data.users} />
</div>

<script lang="ts">
	import AreaChart from '$lib/components/charts/AreaChart.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<p>
	Start: {data.target?.startDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
</p>


<AreaChart></AreaChart>
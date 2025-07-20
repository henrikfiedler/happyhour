<script lang="ts">
	import { LineChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveNatural, curveStepAfter } from 'd3-shape';
	import * as Chart from '$lib/components/ui/chart';
	// import type { TargetEntryComparison } from '$lib/types';

	type UserCountType = {
		date: Date;
		cumulativeCount: number;
	};

	// let { chartData }: { chartData: TargetEntryComparison[] } = $props();
	let { chartData }: { chartData: UserCountType[] } = $props();

	const chartConfig = {
		cumulativeCount: { label: 'User', color: 'var(--chart-1)' },
		// planned: { label: 'Plan', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="mb-5">
	<LineChart
		data={chartData}
		x="date"
		xScale={scaleUtc()}
		axis="x"
		series={[
			{
				key: 'cumulativeCount',
				label: chartConfig.cumulativeCount.label,
				color: chartConfig.cumulativeCount.color,
			},
			// {
			// 	key: 'planned',
			// 	label: 'Soll',
			// 	color: chartConfig.planned.color
			// }
		]}
		props={{
			spline: {
				curve: curveNatural,
				// 'fill-opacity': 0.3,
				motion: 'tween',
				strokeWidth: 2
			},
			xAxis: {
				format: (v: Date) => v.toLocaleDateString(undefined, { dateStyle: 'short' })
			},
			highlight: { points: { r: 4 } }
		}}
	>
		{#snippet tooltip()}
			<Chart.Tooltip
				labelFormatter={(v: Date) => {
					return v.toLocaleDateString(undefined, {
						dateStyle: 'long'
					});
				}}
				indicator="line"
			/>
		{/snippet}
	</LineChart>
</Chart.Container>

<script lang="ts">
	import { AreaChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import * as Chart from '$lib/components/ui/chart';
	import type { TargetEntryComparison } from '$lib/types';

	let { chartData }: { chartData: TargetEntryComparison[] } = $props();

	const chartConfig = {
		actual: { label: 'Ist', color: 'var(--chart-1)' },
		planned: { label: 'Soll', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig} class="mb-5">
	<AreaChart
		data={chartData}
		x="date"
		xScale={scaleUtc()}
		axis="x"
		series={[
			{
				key: 'actual',
				label: 'Ist',
				color: chartConfig.actual.color
			},
			{
				key: 'planned',
				label: 'Soll',
				color: chartConfig.planned.color
			}
		]}
		props={{
			area: {
				curve: curveNatural,
				'fill-opacity': 0.3,
				line: { class: 'stroke-1' },
				motion: 'tween'
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
	</AreaChart>
</Chart.Container>

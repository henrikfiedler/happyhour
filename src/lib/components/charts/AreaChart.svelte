<script lang="ts">
	import { AreaChart } from 'layerchart';
	import { scaleUtc } from 'd3-scale';
	import { curveNatural } from 'd3-shape';
	import * as Chart from '$lib/components/ui/chart';

	const chartData = [
		{ date: new Date('2024-01-01'), value: 186, baseline: 80 },
		{ date: new Date('2024-02-01'), value: 305, baseline: 200 },
		{ date: new Date('2024-03-01'), value: 237, baseline: 120 },
		{ date: new Date('2024-04-01'), value: 73, baseline: 190 },
		{ date: new Date('2024-05-01'), value: 209, baseline: 130 },
		{ date: new Date('2024-06-01'), value: 214, baseline: 140 }
	];

	const chartConfig = {
		value: { label: 'Ist', color: 'var(--chart-1)' },
		baseline: { label: 'Soll', color: 'var(--chart-2)' }
	} satisfies Chart.ChartConfig;
</script>

<Chart.Container config={chartConfig}>
	<AreaChart
		data={chartData}
		x="date"
		xScale={scaleUtc()}
		axis="x"
		series={[
			{
				key: 'value',
				label: 'Ist',
				color: chartConfig.value.color
			},
			{
				key: 'baseline',
				label: 'Soll',
				color: chartConfig.baseline.color
			}
		]}
		props={{
			area: {
				curve: curveNatural,
				'fill-opacity': 0.3,
				line: { class: 'stroke-1' },
				motion: 'tween',
			},
			xAxis: {
				format: (v: Date) => v.toLocaleDateString(undefined, { month: '2-digit', year: '2-digit' })
			},
			highlight: { points: { r: 4 } }
		}}
	>
		{#snippet tooltip()}
			<Chart.Tooltip
				labelFormatter={(v: Date) => {
					return v.toLocaleDateString(undefined, {
						month: 'long'
					});
				}}
				indicator="line"
			/>
		{/snippet}
	</AreaChart>
</Chart.Container>

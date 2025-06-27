<script lang="ts">
	import AreaChart from '$lib/components/charts/area-chart.svelte';
	import type { PageData } from './$types';
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { AbsenceEntry, TargetEntryComparison } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import Holidays from 'date-holidays';
	import { determineChartData, getISODateString } from '$lib/target';

	let { data }: { data: PageData } = $props();

	// Berechne Planwerte basierend auf Zielwert, Start- und Enddatum
	/* const targetValue = data.target.targetValue ?? 0;
	const startDate = new Date(data.target.startDate);
	const endDate = new Date(data.target.endDate); */

	// Planwerte berechnen (linear verteilt)
	/* const days = getDateRange(startDate, endDate);
	const totalDays = days.length
	const totalWorkdays = days.filter((date) => workdays.includes(date.getDay())).length;
	const planPerDay = totalWorkdays > 1 ? targetValue / totalWorkdays : targetValue;
 */
	// Kumulierte Planwerte
	let planSum = 0;
	/* const planData = days.map((date, i) => {
		// planSum = i === 0 ? 0 : planSum + planPerDay;
		// planSum = i === 0 ? planPerDay : planSum + planPerDay;
		if (workdays.includes(date.getDay())) {
			planSum += planPerDay;
		}
		return {
			date: date.toISOString().slice(0, 10),
			plan: Math.round(planSum)
		};
	}); */

	// Ist-Werte berechnen (kumuliert)
	/* const actualMap = new Map<string, number>();
	for (const entry of data.targetEntries) {
		// Verteile entryValue gleichmäßig auf alle Tage zwischen startDate und endDate
		const entryDays = getDateRange(entry.startDate, entry.endDate);
		const entryWorkdays = entryDays.filter((date) => workdays.includes(date.getDay())).length;
		const valuePerDay = entryWorkdays > 0 ? entry.entryValue / entryWorkdays : 0;

		let newValue = 0;
		for (const day of entryDays) {
			const d = day.toISOString().slice(0, 10);
			const value = workdays.includes(day.getDay()) ? valuePerDay : 0;
			// actualMap.set(d, (actualMap.get(d) ?? 0) + valuePerDay);
			actualMap.set(d, value);
		}
	} */

	/* let actual = 0;
	const actualData = days.map((date) => {
		actual += actualMap.get(date.toISOString().slice(0, 10)) ?? 0;
		return {
			date,
			actual
		};
	}); */

	// ChartData zusammenführen
	/* const chartData: TargetEntryComparison[] = days.map((date, i) => ({
		date: date,
		planned: planData[i].plan,
		actual: actualData[i].actual
	})); */

	const { planPerDay, chartData } = determineChartData(
		data.target,
		data.targetEntries,
		data.absenceEntries,
		data.holidayData
	);

	let targetValueToDate =
		chartData.find((data) => data.date.toISOString().slice(0, 10) === getISODateString(new Date()))
			?.planned ?? chartData[chartData.length - 1].planned;
</script>

{#snippet headerCard(title: string, value: any, secondary?: any)}
	<Card.Root class="@container/card">
		<Card.Header>
			<Card.Description>{title}</Card.Description>
			<Card.Title class="text-lg font-semibold lg:text-2xl">
				{#if value instanceof Date}
					<LocalDateComponent date={value} />
				{:else}
					{value}
					{#if secondary}<span class="text-muted-foreground">({secondary})</span>{/if}
				{/if}
			</Card.Title>
		</Card.Header>
	</Card.Root>
{/snippet}

<div class="mb-5 grid grid-cols-2 gap-3">
	{@render headerCard('Start', data.target.startDate)}
	{@render headerCard('Ende', data.target.endDate)}
	{@render headerCard('Plan', targetValueToDate, data.target.targetValue)}
	{@render headerCard(
		'Ist',
		data.targetEntries.reduce((acc, entry) => acc + entry.entryValue, 0)
	)}
</div>

<AreaChart {chartData}></AreaChart>

<!-- <Separator class="my-3"></Separator> -->

<!-- <pre>{JSON.stringify(data.absenceEntries, null, 2)}</pre> -->

<!-- <form method="POST" use:enhance>
	<Form.Field {form} name="startDate">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Start</Form.Label>
				<Input
					type="date"
					min={data.target.startDate.toISOString().slice(0, 10)}
					max={data.target.endDate.toISOString().slice(0, 10)}
					{...props}
					bind:value={$startDateProxy}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="endDate">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Ende</Form.Label>
				<Input
					type="date"
					min={data.target.startDate.toISOString().slice(0, 10)}
					max={data.target.endDate.toISOString().slice(0, 10)}
					{...props}
					bind:value={$endDateProxy}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="entryValue">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Leistung</Form.Label>
				<Input type="number" {...props} bind:value={$formData.entryValue} />
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Button type="submit">Hinzufügen</Button>
</form>

<SuperDebug data={$formData} display={false} /> -->

<!-- <TargetEntryTableComponent targetEntries={data.targetEntries} /> -->

<script lang="ts">
	import TargetEntryTableComponent from '$lib/components/TargetEntryTableComponent.svelte';
	import AreaChart from '$lib/components/charts/AreaChart.svelte';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { targetEntryInsertSchema } from '$lib/schemas';
	import { Button } from '$lib/components/ui/button';
	import LocalDateComponent from '$lib/components/LocalDateComponent.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { TargetEntryComparison } from '$lib/types';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(targetEntryInsertSchema)
	});

	const { form: formData, enhance } = form;

	const startDateProxy = dateProxy(form, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(form, 'endDate', {
		format: 'date'
	});

	// Berechne Planwerte basierend auf Zielwert, Start- und Enddatum
	const targetValue = data.target?.targetValue ?? 0;
	const startDate = new Date(data.target?.startDate);
	const endDate = new Date(data.target?.endDate);

	// Hilfsfunktion: Gibt alle Tage zwischen zwei Daten als Array von Date-Objekten zurück
	function getDateRange(start: Date, end: Date): Date[] {
		const dates = [];
		let current = new Date(start);
		while (current <= end) {
			dates.push(new Date(current));
			current.setDate(current.getDate() + 1);
		}
		return dates;
	}

	// Planwerte berechnen (linear verteilt)
	const days = getDateRange(startDate, endDate);
	const totalDays = days.length;
	const planPerDay = totalDays > 1 ? targetValue / totalDays : targetValue;

	// Kumulierte Planwerte
	let planSum = 0;
	const planData = days.map((date, i) => {
		// planSum = i === 0 ? 0 : planSum + planPerDay;
		// planSum = i === 0 ? planPerDay : planSum + planPerDay;
		planSum += planPerDay;
		return {
			date: date.toISOString().slice(0, 10),
			plan: Math.round(planSum)
		};
	});

	// Ist-Werte berechnen (kumuliert)
	const actualMap = new Map<string, number>();
	for (const entry of data.targetEntries) {
		// Verteile entryValue gleichmäßig auf alle Tage zwischen startDate und endDate
		const entryDays = getDateRange(entry.startDate, entry.endDate);
		const valuePerDay = entryDays.length > 0 ? entry.entryValue / entryDays.length : 0;

		for (const day of entryDays) {
			const d = day.toISOString().slice(0, 10);
			actualMap.set(d, (actualMap.get(d) ?? 0) + valuePerDay);
		}
	}

	let actual = 0;
	const actualData = days.map((date) => {
		actual += actualMap.get(date.toISOString().slice(0, 10)) ?? 0;
		return {
			date,
			actual
		};
	});

	// ChartData zusammenführen
	const chartData: TargetEntryComparison[] = days.map((date, i) => ({
		date: date,
		planned: planData[i].plan,
		actual: actualData[i].actual
	}));
</script>

<p>
	Start: <LocalDateComponent date={data.target.startDate} />
</p>
<p>
	Ende: <LocalDateComponent date={data.target.endDate} />
</p>
<p>
	Ziel: {data.target.targetValue}
</p>

<Separator class="my-3"></Separator>

<AreaChart {chartData}></AreaChart>

<Separator class="my-3"></Separator>

<form method="POST" use:enhance>
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

<SuperDebug data={$formData} display={false} />

<TargetEntryTableComponent targetEntries={data.targetEntries} />

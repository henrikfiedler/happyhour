<script lang="ts">
	import AreaChart from '$lib/components/charts/AreaChart.svelte';
	import type { PageData } from './$types';
	import LocalDateComponent from '$lib/components/LocalDateComponent.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import type { TargetEntryComparison } from '$lib/types';
	import * as Card from '$lib/components/ui/card';
	import Holidays from 'date-holidays';

	let { data }: { data: PageData } = $props();

	// Berechne Planwerte basierend auf Zielwert, Start- und Enddatum
	/* const targetValue = data.target.targetValue ?? 0;
	const startDate = new Date(data.target.startDate);
	const endDate = new Date(data.target.endDate); */

	// Hilfsfunktion: Gibt alle Tage zwischen zwei Daten als Array von Date-Objekten zurück
	function getDateRange(start: Date, end: Date | null): string[] {
		const dates: string[] = [];
		// Create UTC dates to avoid DST issues
		let current = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));

		if (!end) {
			return [getISODateString(current)];
		}

		const endDateUTC = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

		while (current <= endDateUTC) {
			dates.push(getISODateString(current));
			// Increment by exactly 24 hours in milliseconds
			current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
		}
		return dates;
	}

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

	function checkDateIsWorkday(date: Date): boolean {
		const workday = date.getDay();

		switch (workday) {
			case 0:
				return data.target.sundayIsWorkday;
			case 1:
				return data.target.mondayIsWorkday;
			case 2:
				return data.target.tuesdayIsWorkday;
			case 3:
				return data.target.wednesdayIsWorkday;
			case 4:
				return data.target.thursdayIsWorkday;
			case 5:
				return data.target.fridayIsWorkday;
			case 6:
				return data.target.saturdayIsWorkday;
			default:
				return false; // Sollte nie erreicht werden
		}
	}

	function checkIsWorkday(date: Date): boolean {
		return checkDateIsWorkday(date) && !checkIsHoliday(date);
	}

	function getTotalWorkdays(startDate: Date, endDate: Date): number {
		const days = getDateRange(startDate, endDate);
		return days.filter((date) => checkDateIsWorkday(new Date(date))).length;
	}

	function getTotalOffdays(startDate: Date, endDate: Date): number {
		const days = getDateRange(startDate, endDate);
		return days.filter((date) => !checkDateIsWorkday(new Date(date))).length;
	}

	let hd =
		data.holidayData?.country && data.holidayData.state
			? new Holidays(
					{
						country: data.holidayData.country,
						state: data.holidayData.state,
						region: data.holidayData.region ?? undefined
					},
					{ types: ['public'] }
				)
			: undefined;

	function checkIsHoliday(date: Date): boolean {
		const holiday = hd?.isHoliday(date) ?? undefined;
		// return holiday ? holiday[0].type === 'public' : false;
		return !!holiday;
	}

	function getTotalHolidays(startDate: Date, endDate: Date): number {
		const days = getDateRange(startDate, endDate);
		return days.filter((date) => checkIsHoliday(new Date(date))).length;
	}

	function getISODateString(date: Date): string {
		return date.toISOString().slice(0, 10);
	}

	function determineChartData(): TargetEntryComparison[] {
		const days = getDateRange(data.target.startDate, data.target.endDate);
		const totalOffdays = getTotalOffdays(data.target.startDate, data.target.endDate);
		const totalHolidays = getTotalHolidays(data.target.startDate, data.target.endDate);
		const totalWorkdays = days.length - totalOffdays - totalHolidays;
		const planPerDay = totalWorkdays > 0 ? data.target.targetValue / totalWorkdays : 0;

		let planSum = 0;
		let actualSum = 0;
		return days.map((dateString, i) => {
			const date = new Date(dateString);

			planSum += checkIsWorkday(date) ? planPerDay : 0;

			const entry = data.targetEntries.find((entry) => {
				return entry.endDate
					? dateString >= getISODateString(entry.startDate) &&
							dateString <= getISODateString(entry.endDate)
					: dateString === getISODateString(entry.startDate);
			});

			const actualPerDay = entry
				? entry.entryValue /
					/* getDateRange(entry.startDate, entry.endDate)
			.filter((e) => checkIsWorkday(new Date(e)))
			.length */
					getDateRange(entry.startDate, entry?.endDate).length
				: 0;

			actualSum += actualPerDay;
			return {
				date,
				planned: Math.round(planSum),
				actual: date <= new Date() ? Math.round(actualSum) : null
			};
		});
	}

	const chartData: TargetEntryComparison[] = determineChartData();

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

<Separator class="my-3"></Separator>

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

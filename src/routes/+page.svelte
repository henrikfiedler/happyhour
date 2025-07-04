<script lang="ts">
	import AreaChart from '$lib/components/charts/area-chart.svelte';
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Separator } from '$lib/components/ui/separator';
	import { determineChartData, getISODateString } from '$lib/target';
	import type { AbsenceEntry, HolidayData, Target, TargetEntry } from '$lib/types';
	import { createDemoData } from '$lib/demo-data';
	import TargetEntryDataTable from '$lib/components/target-entry-data-table.svelte';
	import AbsenceEntryDataTable from '$lib/components/absence-entry-data-table.svelte';
	import type { PageData } from './$types';
	import TargetHeader from '$lib/components/target-header.svelte';

	let { data }: { data: PageData } = $props();

	let today = new Date();
	const { target, absenceEntries, absencePlans, targetEntries } = createDemoData(today);

	let holidayData: HolidayData | undefined = {
		country: 'DE',
		region: 'BW',
		state: null
	};

	let { chartData, plannedDays, actualDays, actualValue, lastActualDate, plannedValueToDate } =
		determineChartData(target, targetEntries, absenceEntries, absencePlans, holidayData);

	let plannedValuePerDay = plannedValueToDate
		? Math.round((plannedValueToDate / actualDays) * 100) / 100
		: 0;

	let actualValuePerDay = Math.round((actualValue / actualDays) * 100) / 100;

	let requiredValuePerDay =
		Math.round(((target.targetValue - actualValue) / (plannedDays - actualDays)) * 100) / 100;
</script>

<section class="bg-accent flex min-h-screen items-center justify-center">
	<div class="flex flex-col items-center justify-center gap-8 p-8">
		<Card.Root>
			<Card.Content class="flex flex-col items-center gap-4 p-8">
				<h1 class="text-5xl font-extrabold drop-shadow">HappyHour</h1>
				<Separator></Separator>
				<p class="text-muted-foreground max-w-xl text-center text-lg">
					Verfolge deine Leistung, plane bewusst deine Ziele und finde die Balance zwischen
					Produktivität und Erholung. HappyHour unterstützt dich dabei, mit Klarheit und Fokus durch
					dein Arbeitsjahr zu gehen.
				</p>
				<div class="flex gap-4">
					{#if !data.user}
						<Button size="lg" variant="secondary" href="/login">Login</Button>
						<Button size="lg" variant="default" href="/register">Kostenlos starten</Button>
					{:else}
						<Button size="lg" variant="default" href="/targets">Zu deinen Zielen</Button>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</section>

<section class="py-10">
	<div class="grid grid-cols-1 gap-5">
		<div>
			<h2 class="text-center text-2xl font-bold">
				Interaktive Demo: So sieht HappyHour in Aktion aus
			</h2>
		</div>
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

		<div class="mb-5">
			<TargetHeader
				{target}
				{plannedValueToDate}
				{actualValue}
				{plannedValuePerDay}
				{actualValuePerDay}
				{requiredValuePerDay}
				{lastActualDate}
			></TargetHeader>
		</div>
		<!-- <div class="flex flex-col items-center justify-center gap-8 p-8"> -->
		<AreaChart {chartData}></AreaChart>
		<!-- </div> -->

		<Tabs.Root value="entries">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="entries">Leistungen</Tabs.Trigger>
				<Tabs.Trigger value="absences">Abwesenheiten</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="entries">
				<TargetEntryDataTable {targetEntries} withDeleteDialog={false}></TargetEntryDataTable>
			</Tabs.Content>
			<Tabs.Content value="absences">
				<AbsenceEntryDataTable {absenceEntries} withDeleteDialog={false}></AbsenceEntryDataTable>
			</Tabs.Content>
		</Tabs.Root>
		<Separator></Separator>
		<div>
			<p class="mt-6 text-center text-lg">Du willst das auch für dich nutzen?</p>
			<div class="mt-2 flex justify-center gap-4">
				{#if !data.user}
					<Button size="lg" variant="secondary" href="/login">Login</Button>
					<Button size="lg" variant="default" href="/register">Kostenlos starten</Button>
				{:else}
					<Button size="lg" variant="default" href="/targets">Zu deinen Zielen</Button>
				{/if}
			</div>
		</div>
	</div>
</section>

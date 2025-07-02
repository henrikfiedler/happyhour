<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import type { Target } from '$lib/types';

	interface Props {
		target: Target;
		plannedValueToDate: number;
		actualValue: number;
		plannedValuePerDay: number;
		actualValuePerDay: number;
		requiredValuePerDay: number;
		lastActualDate: Date;
	}

	let {
		target,
		plannedValueToDate,
		actualValue,
		plannedValuePerDay,
		actualValuePerDay,
		requiredValuePerDay,
		lastActualDate
	}: Props = $props();
</script>

<div class="grid grid-cols-1 gap-3">
	<div class="grid grid-cols-2 gap-3">
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Start</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					<LocalDateComponent date={target.startDate} />
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>Ende</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					<LocalDateComponent date={target.endDate} />
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>
	<div class="grid grid-cols-3 gap-3">
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Plan<br />
					<!-- <span class="text-xs">bis <LocalDateComponent date={data.target.endDate} /></span> -->
					<span class="text-xs">bis Ende</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{target.targetValue.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Plan<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate}></LocalDateComponent>
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{plannedValueToDate.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Ist<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate}></LocalDateComponent>
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					<!-- {data.targetEntries.reduce((acc, entry) => acc + entry.entryValue, 0).toLocaleString()} -->
					{actualValue.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<!-- {@render headerCard('Start', data.target.startDate)}
		{@render headerCard('Ende', data.target.endDate)}
		{@render headerCard('Plan', targetValueToDate, data.target.targetValue)}
		{@render headerCard(
			'Ist',
			data.targetEntries.reduce((acc, entry) => acc + entry.entryValue, 0)
		)} -->
	</div>
	<div class="grid grid-cols-3 gap-3">
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Plan <br class="block sm:hidden" />/ Tag<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate}></LocalDateComponent>
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{plannedValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Ist <br class="block sm:hidden" />/ Tag<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate}></LocalDateComponent>
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{actualValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Soll <br class="block sm:hidden" />/ Tag<br />
					<!-- <span class="text-xs">bis <LocalDateComponent date={data.target.endDate} /></span> -->
					<span class="text-xs">bis Ende</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{requiredValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<!-- {@render headerCard('Plan / Tag', plannedValuePerDay)}
		{@render headerCard('Ist / Tag', actualValuePerDay)}
		{@render headerCard('Rest / Tag', requiredValuePerDay)} -->
	</div>
</div>

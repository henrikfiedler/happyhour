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
					<span class="text-xs">
						bis <LocalDateComponent date={target.endDate} />
					</span>
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
						bis <LocalDateComponent date={lastActualDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{Math.round(plannedValueToDate).toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Ist<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					<!-- {data.targetEntries.reduce((acc, entry) => acc + entry.entryValue, 0).toLocaleString()} -->
					{actualValue.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>
	<div class="grid grid-cols-3 gap-3">
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>
					Plan <br class="block sm:hidden" />/ Tag<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate} />
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
						bis <LocalDateComponent date={lastActualDate} />
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
					<span class="text-xs">
						bis <LocalDateComponent date={target.endDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{requiredValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
	</div>
</div>

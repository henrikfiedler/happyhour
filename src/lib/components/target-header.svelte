<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import type { Target } from '$lib/types';
	import TargetHeaderCard from './target-header-card.svelte';

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
		<TargetHeaderCard label="Start" date={target.startDate} />
		<TargetHeaderCard label="Ende" date={target.endDate} />
		<!-- <Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>Start</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					<LocalDateComponent date={target.startDate} />
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>Ende</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					<LocalDateComponent date={target.endDate} />
				</Card.Title>
			</Card.Header>
		</Card.Root> -->
	</div>
	<div class="grid grid-cols-3 gap-3">
		<TargetHeaderCard label="Plan" date={target.endDate} value={target.targetValue} />
		<TargetHeaderCard label="Plan" date={lastActualDate} value={plannedValueToDate} />
		<TargetHeaderCard label="Ist" date={lastActualDate} value={actualValue} />

		<!-- <Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
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
		<Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>
					Plan<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{plannedValueToDate.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>
					Ist<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{actualValue.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root> -->
	</div>
	<div class="grid grid-cols-3 gap-3">
		<TargetHeaderCard label="Plan / Tag" date={lastActualDate} value={plannedValuePerDay} />
		<TargetHeaderCard label="Ist / Tag" date={lastActualDate} value={actualValuePerDay} />
		<TargetHeaderCard label="Soll / Tag" date={target.endDate} value={requiredValuePerDay} />

		<!-- <Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>
					Plan / Tag<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{plannedValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>
					Ist / Tag<br />
					<span class="text-xs">
						bis <LocalDateComponent date={lastActualDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{actualValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root>
		<Card.Root class="@container/card py-3 sm:py-6">
			<Card.Header class="px-3 sm:px-6">
				<Card.Description>
					Soll / Tag<br />
					<span class="text-xs">
						bis <LocalDateComponent date={target.endDate} />
					</span>
				</Card.Description>
				<Card.Title class="text-lg font-semibold lg:text-2xl">
					{requiredValuePerDay.toLocaleString()}
				</Card.Title>
			</Card.Header>
		</Card.Root> -->
	</div>
</div>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import LocalDateComponent from './local-date-component.svelte';

	interface Props {
		label: string;
		value?: number;
		date: Date;
	}

	let { label, value, date }: Props = $props();
</script>

<Card.Root class="@container/card py-3 sm:py-6">
	<Card.Header class="px-3 sm:px-6">
		<Card.Description>
			{label}<br />
			{#if value !== undefined}
				<span class="text-xs">
					bis <LocalDateComponent {date} />
				</span>
			{/if}
		</Card.Description>
		<Card.Title class="text-lg font-semibold lg:text-2xl">
			{#if value !== undefined}
				{value.toLocaleString()}
			{:else}
				<LocalDateComponent {date} />
			{/if}
		</Card.Title>
	</Card.Header>
</Card.Root>

<script lang="ts">
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import TargetTableComponent from '$lib/components/TargetTableComponent.svelte';

	let { data }: { data: PageData } = $props();
</script>

{#if data.user}
	<TargetTableComponent targets={data.targets} favoriteTargetId={data.user.favoriteTargetId} />

	<!-- <form method="POST" use:enhance>
		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Bezeichnung</Form.Label>
					<Input {...props} bind:value={$formData.description} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="startDate">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Start</Form.Label>
					<Input type="date" {...props} bind:value={$startDateProxy} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="endDate">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Ende</Form.Label>
					<Input type="date" {...props} bind:value={$endDateProxy} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="targetValue">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Zielwert</Form.Label>
					<Input type="number" {...props} bind:value={$formData.targetValue} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button type="submit">Speichern</Button>
	</form>

	<SuperDebug data={$formData} display={false} /> -->
{:else}
	<p>You are not logged in.</p>
{/if}

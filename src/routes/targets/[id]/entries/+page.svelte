<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import SuperDebug, { dateProxy, superForm } from 'sveltekit-superforms';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import { targetEntryInsertSchema } from '$lib/schemas';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Button } from '$lib/components/ui/button';
	import TargetEntryDataTable from '$lib/components/target-entry-data-table.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import SubmitButton from '$lib/components/forms/submit-button.svelte';

	let { data }: { data: PageData } = $props();
	const form = superForm(data.form, {
		validators: zodClient(targetEntryInsertSchema)
	});

	const { form: formData, enhance, submitting } = form;

	const startDateProxy = dateProxy(form, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(form, 'endDate', {
		format: 'date'
	});
</script>

<form action="?/create" method="POST" use:enhance>
	<div class="grid gap-2 sm:grid-cols-3">
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
					<Form.Label>Ende (optional)</Form.Label>
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
	</div>
	<SubmitButton {submitting}>Hinzufügen</SubmitButton>
</form>

<SuperDebug data={$formData} display={false} />

<Separator class="my-5"></Separator>

<!-- <TargetEntryTableComponent targetEntries={data.targetEntries} /> -->

<TargetEntryDataTable targetEntries={data.targetEntries} withDeleteDialog={true}
></TargetEntryDataTable>

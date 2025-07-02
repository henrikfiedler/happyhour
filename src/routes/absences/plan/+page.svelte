<script lang="ts">
	import type { PageData } from './$types';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { dateProxy, superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { absenceEntryInsertSchema, absencePlanInsertSchema } from '$lib/schemas';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import AbsenceEntryDataTable from '$lib/components/absence-entry-data-table.svelte';
	import { absenceEntryTypesArray } from '$lib/types';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import SubmitButton from '$lib/components/forms/submit-button.svelte';
	import { Label } from '$lib/components/ui/label';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(absencePlanInsertSchema),
		resetForm: false
	});

	const { form: formData, enhance, submitting } = form;

	let oldYear = data.selectedYear.getFullYear().toString();
	let selectedYear: string = $state(data.selectedYear.getFullYear().toString());

	let getForm: HTMLFormElement;

	$effect(() => {
		if (getForm && selectedYear && selectedYear !== oldYear) {
			oldYear = selectedYear;
			getForm.requestSubmit();
		}
	});

	function handleChange() {
		console.log('Selected year changed:', selectedYear);
		getForm.requestSubmit();
	}
</script>

<form method="get" bind:this={getForm}>
	<!-- <input type="hidden" name="selectedYear" bind:value={selectedYear} /> -->
	<div class="mb-2 flex flex-row gap-3">
		<Label>Jahr:</Label>
		<Select.Root type="single" name="selectedYear" bind:value={selectedYear}>
			<Select.Trigger class="w-[180px]">
				{selectedYear}
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Jahr</Select.Label>
					{#each data.selectYears as year (year)}
						<Select.Item value={year} label={year}>
							{year}
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
	<!-- <select onchange={handleChange} name="selectedYear" bind:value={selectedYear}>
		{#each data.selectYears as year (year)}
			<option value={year}>{year}</option>
		{/each}
	</select> -->
	<!-- <Button type="submit">Jahr wechseln</Button> -->
</form>

<form action="?/createPlan" method="post" use:enhance>
	<Form.Field {form} name="year">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Input type="hidden" {...props} bind:value={$formData.year} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="vacationValue">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Form.Label>Urlaub</Form.Label>
					<Input type="number" {...props} bind:value={$formData.vacationValue} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="sickValue">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Form.Label>Krankheit</Form.Label>
					<Input type="number" {...props} bind:value={$formData.sickValue} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="miscValue">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Form.Label>Sonstiges</Form.Label>
					<Input type="number" {...props} bind:value={$formData.miscValue} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<SubmitButton {submitting}>Speichern</SubmitButton>
</form>

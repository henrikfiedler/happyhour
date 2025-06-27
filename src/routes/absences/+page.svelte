<script lang="ts">
	import type { PageData } from './$types';
	import * as Select from '$lib/components/ui/select';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { dateProxy, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { absenceEntryInsertSchema } from '$lib/schemas';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import AbsenceEntryDataTable from '$lib/components/absence-entry-data-table.svelte';
	import { absenceEntryTypesArray } from '$lib/types';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import SubmitButton from '$lib/components/forms/submit-button.svelte';

	let { data }: { data: PageData } = $props();

	/* const planForm = superForm(data.planForm, {
		validators: zodClient(absencePlanInsertSchema),
		resetForm: false
	});

	const { form: planFormData, enhance } = planForm; */

	const entryForm = superForm(data.entryForm, {
		validators: zodClient(absenceEntryInsertSchema),
		resetForm: true
	});

	const { form: entryFormData, enhance: entryEnhance, submitting } = entryForm;

	const startDateProxy = dateProxy(entryForm, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(entryForm, 'endDate', {
		format: 'date'
	});

	/* let selectedYear: string = $state(data.selectedYear.getFullYear().toString());

	let getForm: HTMLFormElement; */
</script>

<!-- <h2 class="mb-2 text-2xl">Geplante Abwesenheitstage</h2>

<form method="get" bind:this={getForm}>
	<div class="mb-2">
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
	<Button type="submit">Jahr wechseln</Button>
</form>

<form action="?/createPlan" method="post" use:enhance>
	<Form.Field form={planForm} name="year">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Input type="hidden" {...props} bind:value={$planFormData.year} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={planForm} name="vacationValue">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Form.Label>Urlaub</Form.Label>
					<Input type="number" {...props} bind:value={$planFormData.vacationValue} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={planForm} name="sickValue">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Form.Label>Krankheit</Form.Label>
					<Input type="number" {...props} bind:value={$planFormData.sickValue} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field form={planForm} name="miscValue">
		<Form.Control>
			{#snippet children({ props })}
				<div class="grid grid-cols-2">
					<Form.Label>Sonstiges</Form.Label>
					<Input type="number" {...props} bind:value={$planFormData.miscValue} />
				</div>
			{/snippet}
		</Form.Control>
		<Form.Description />
		<Form.FieldErrors />
	</Form.Field>
	<Form.Button>Speichern</Form.Button>
</form>

<Separator class="my-4"></Separator> -->

<h2 class="mb-2 text-2xl">Abwesenheiten</h2>

<form class="mb-5" action="?/createEntry" method="post" use:entryEnhance>
	<div class="grid gap-2 sm:grid-cols-2">
		<Form.Field form={entryForm} name="type">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Typ</Form.Label>
					<Select.Root type="single" bind:value={$entryFormData.type} name={props.name}>
						<Select.Trigger {...props}>
							{absenceEntryTypesArray.find((e) => e.value === $entryFormData.type)?.label}
						</Select.Trigger>
						<Select.Content>
							{#each absenceEntryTypesArray as { value, label }}
								<Select.Item {value} {label} />
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={entryForm} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Beschreibung (optional)</Form.Label>
					<Input {...props} bind:value={$entryFormData.description} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={entryForm} name="startDate">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Start</Form.Label>
					<Input type="date" {...props} bind:value={$startDateProxy} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field form={entryForm} name="endDate">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Ende (optional)</Form.Label>
					<Input type="date" {...props} bind:value={$endDateProxy} />
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<SubmitButton {submitting}>Hinzufügen</SubmitButton>
</form>

<div class="mb-10">
	<AbsenceEntryDataTable absenceEntries={data.absenceEntries} withDeleteDialog={true}
	></AbsenceEntryDataTable>
</div>

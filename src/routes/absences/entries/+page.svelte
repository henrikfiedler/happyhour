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

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(absenceEntryInsertSchema),
		resetForm: true
	});

	const { form: formData, enhance, submitting } = form;

	const startDateProxy = dateProxy(form, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(form, 'endDate', {
		format: 'date'
	});
</script>

<form class="mb-5" action="?/createEntry" method="post" use:enhance>
	<div class="grid gap-2 sm:grid-cols-2">
		<Form.Field {form} name="type">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Typ</Form.Label>
					<Select.Root type="single" bind:value={$formData.type} name={props.name}>
						<Select.Trigger {...props}>
							{absenceEntryTypesArray.find((e) => e.value === $formData.type)?.label}
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
		<Form.Field {form} name="description">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Beschreibung (optional)</Form.Label>
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

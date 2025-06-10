<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { targetUpdateSchema } from '$lib/schemas';
	import SuperDebug, { dateProxy, superForm } from 'sveltekit-superforms';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { Input } from '$lib/components/ui/input';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import Button from '../ui/button/button.svelte';
	import WeekDayCheckbox from './WeekDayCheckbox.svelte';
	import { Checkbox } from '../ui/checkbox';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	type TargetSchema = typeof targetUpdateSchema;

	let { rawForm }: { rawForm: SuperValidated<Infer<TargetSchema>> } = $props();

	const form = superForm(rawForm, {
		validators: zodClient(targetUpdateSchema),
		resetForm: false
	});

	const { form: formData, enhance, submitting } = form;

	const startDateProxy = dateProxy(form, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(form, 'endDate', {
		format: 'date'
	});
</script>

<form action="?/target" method="POST" use:enhance>
	<div class="grid gap-2 sm:grid-cols-2">
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
	</div>
	<fieldset>
		<legend>Arbeitstage</legend>
		<div class="grid grid-cols-3 gap-2 sm:grid-cols-7">
			<Form.Field {form} name="mondayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Montag</Form.Label>
						<Checkbox {...props} bind:checked={$formData.mondayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="tuesdayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Dienstag</Form.Label>
						<Checkbox {...props} bind:checked={$formData.tuesdayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="wednesdayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Mittwoch</Form.Label>
						<Checkbox {...props} bind:checked={$formData.wednesdayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="thursdayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Donnerstag</Form.Label>
						<Checkbox {...props} bind:checked={$formData.thursdayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="fridayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Freitag</Form.Label>
						<Checkbox {...props} bind:checked={$formData.fridayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="saturdayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Samstag</Form.Label>
						<Checkbox {...props} bind:checked={$formData.saturdayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="sundayIsWorkday">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Sonntag</Form.Label>
						<Checkbox {...props} bind:checked={$formData.sundayIsWorkday} />
					{/snippet}
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</fieldset>

	<Button type="submit">
		{#if $submitting}
			<LoaderCircle class="animate-spin" />
		{/if}
		Speichern
	</Button>
</form>

<SuperDebug data={$formData} display={false} />

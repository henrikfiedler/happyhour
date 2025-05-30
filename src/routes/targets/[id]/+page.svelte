<script lang="ts">
	import TargetEntryTableComponent from '$lib/components/TargetEntryTableComponent.svelte';
	import type { PageData } from './$types';
	import * as Form from '$lib/components/ui/form';
	import SuperDebug from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import { Input } from '$lib/components/ui/input';
	import { targetEntryInsertSchema } from '$lib/schemas';
	import { Button } from '$lib/components/ui/button';
	import LocalDateComponent from '$lib/components/LocalDateComponent.svelte';
	import { Separator } from '$lib/components/ui/separator';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(targetEntryInsertSchema)
	});

	const { form: formData, enhance } = form;

	const startDateProxy = dateProxy(form, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(form, 'endDate', {
		format: 'date'
	});
</script>

<p>
	Start: <LocalDateComponent date={data.target?.startDate} />
</p>
<p>
	Ende: <LocalDateComponent date={data.target?.endDate} />
</p>

<Separator class="my-3"></Separator>

<form method="POST" use:enhance>
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
	<Button type="submit">Speichern</Button>
</form>

<SuperDebug data={$formData} display={false} />

<TargetEntryTableComponent targetEntries={data.targetEntries} />

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { dateProxy, superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { targetInsertSchema } from '$lib/schemas';
	import * as Form from '$lib/components/ui/form';
	import * as Table from '$lib/components/ui/table';
	import { Input } from '$lib/components/ui/input';
	import SuperDebug from 'sveltekit-superforms';
	import TargetTableComponent from '$lib/components/TargetTableComponent.svelte';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(targetInsertSchema)
	});

	const { form: formData, enhance } = form;

	const startDateProxy = dateProxy(form, 'startDate', {
		format: 'date'
	});
	const endDateProxy = dateProxy(form, 'endDate', {
		format: 'date'
	});
</script>

<h1>User</h1>

{#if data.user}
	<p>E-Mail: {data.user.email}</p>

	<Separator></Separator>
	<h2>Ziele</h2>
	<TargetTableComponent targets={data.targets} />

	<form method="POST" use:enhance>
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

	<SuperDebug data={$formData} display={false} />
{:else}
	<p>You are not logged in.</p>
{/if}

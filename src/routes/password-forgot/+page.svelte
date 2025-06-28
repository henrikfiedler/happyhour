<script lang="ts">
	import { forgotPasswortRequestSchema, forgotPasswortSubmitSchema } from '$lib/schemas';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';

	let { data }: { data: PageData } = $props();

	const requestForm = superForm(data.requestForm, {
		validators: zod4Client(forgotPasswortRequestSchema)
	});
	const submitForm = superForm(data.submitForm, {
		validators: zod4Client(forgotPasswortSubmitSchema)
	});

	const { form: requestFormData, enhance: requestEnhance, message } = requestForm;
	const { form: submitFormData, enhance: submitEnhance } = submitForm;
</script>

<div class="grid grid-cols-1 gap-3">
	<h1 class="text-4xl font-bold">Passwort zurücksetzen</h1>

	{#if data.validToken}
		<form method="POST" action="?/submit" use:submitEnhance>
			<div class="flex flex-col gap-3">
				<Form.Field form={submitForm} name="token">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} type="hidden" bind:value={$submitFormData.token} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field form={submitForm} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Neues Passwort</Form.Label>
							<Input {...props} type="password" bind:value={$submitFormData.password} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button type="submit">Passwort neu setzen</Form.Button>
			</div>
		</form>
	{:else}
		{#if $message?.email}
			<Alert.Root>
				<AlertCircleIcon />
				<Alert.Title>
					Wir haben eine Mail an <strong>{$message.email}</strong> geschickt um dein Passwort zurückzusetzen
				</Alert.Title>
			</Alert.Root>
		{/if}
		<form method="POST" action="?/request" use:requestEnhance>
			<div class="flex flex-col gap-3">
				<Form.Field form={requestForm} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$requestFormData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Button type="submit">Reset-Link anfragen</Form.Button>
			</div>
		</form>
	{/if}
</div>

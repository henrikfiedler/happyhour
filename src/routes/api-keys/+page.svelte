<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { apiKeyCreateSchema } from '$lib/schemas';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import SubmitButton from '$lib/components/forms/submit-button.svelte';
	import ApiKeyDataTable from '$lib/components/api-key-data-table.svelte';
	import CopyIcon from '@lucide/svelte/icons/copy';
	import CheckIcon from '@lucide/svelte/icons/check';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zod4Client(apiKeyCreateSchema),
		resetForm: true
	});

	const { form: formData, enhance, submitting, message } = form;
	let copied = $state(false);

	async function copyApiKey() {
		if (!$message) return;

		await navigator.clipboard.writeText($message);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="max-w-2xl space-y-6">
	<div>
		<h1 class="text-2xl font-semibold">API-Keys</h1>
		<p class="text-sm text-muted-foreground">
			Erstelle einen Schlüssel für Automationen wie Apple Kurzbefehle.
		</p>
	</div>

	{#if $message}
		<div class="space-y-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-4">
			<p class="font-medium">Diesen API-Key jetzt kopieren.</p>
			<p class="text-sm text-muted-foreground">Er wird aus Sicherheitsgründen nur einmal angezeigt.</p>
			<div class="flex flex-col gap-2 sm:flex-row sm:items-start">
				<code class="block flex-1 break-all rounded bg-background p-3 text-sm">{$message}</code>
				<Button
					type="button"
					variant="outline"
					size="sm"
					class="self-start"
					onclick={copyApiKey}
				>
					{#if copied}
						<CheckIcon />
						Kopiert
					{:else}
						<CopyIcon />
						Kopieren
					{/if}
				</Button>
			</div>
		</div>
	{/if}

	<form action="?/create" method="post" use:enhance>
		<Form.Field {form} name="name" class="w-full max-w-xl">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Bezeichnung</Form.Label>
						<div class="flex flex-col gap-2 sm:flex-row">
							<Input
								{...props}
								class="flex-1"
								bind:value={$formData.name}
								placeholder="Apple Kurzbefehle"
							/>
							<div class="self-start">
								<SubmitButton {submitting}>API-Key erstellen</SubmitButton>
							</div>
						</div>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
	</form>

	<ApiKeyDataTable apiKeys={data.apiKeys} />
</div>

<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { registerSchema } from '$lib/schemas';
	import { Checkbox } from '$lib/components/ui/checkbox';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(registerSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-svh flex-col items-center gap-6 p-6 md:p-6">
	<h1 class="text-4xl font-bold">Registrieren</h1>
	<div class="text-center text-sm">
		Du hast bereits einen Account?
		<a href="/login" class="underline underline-offset-4">Login</a>
	</div>
	<div class="w-full max-w-sm">
		<form method="POST" use:enhance>
			<div class="flex flex-col gap-3">
				<Form.Field {form} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$formData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Passwort</Form.Label>
							<Input {...props} type="password" bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Form.Field {form} name="privacyPolicy">
					<Form.Control>
						{#snippet children({ props })}
							<div class="flex flex-row items-center gap-2">
								<Checkbox {...props} bind:checked={$formData.privacyPolicy} />
								<p>
									Ich akzeptiere die <a
										class="text-blue-600 hover:underline"
										href="/privacy-policy"
										target="_blank"
									>
										Datenschutzerklärung
									</a>
								</p>
							</div>
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button type="submit">Registrieren</Form.Button>
			</div>
		</form>
	</div>
</div>

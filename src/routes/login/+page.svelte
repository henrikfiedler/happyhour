<script lang="ts">
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { loginSchema } from '$lib/schemas';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-svh flex-col items-center gap-6 p-6 md:p-6">
	<h1 class="text-4xl font-bold">Login</h1>
	<div class="text-center text-sm">
		Du hast noch keinen Account?
		<a href="/register" class="underline underline-offset-4">Registrieren</a>
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
							<div class="flex items-center">
								<Form.Label>Passwort</Form.Label>
								<a href="##" class="ml-auto text-sm underline-offset-4 hover:underline">
									Passwort vergessen?
								</a>
							</div>
							<Input {...props} type="password" bind:value={$formData.password} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button type="submit">Login</Form.Button>
			</div>
		</form>
	</div>
</div>

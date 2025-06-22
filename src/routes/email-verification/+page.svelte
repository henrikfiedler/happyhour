<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageData, ActionData } from './$types';
	import * as Alert from '$lib/components/ui/alert';
	import CheckCircle2Icon from '@lucide/svelte/icons/check-circle-2';
	import AlertCircleIcon from '@lucide/svelte/icons/alert-circle';
	import { enhance } from '$app/forms';

	let { form, data }: { form: ActionData; data: PageData } = $props();
</script>

<div class="grid grid-cols-1 gap-2">
	<h1 class="text-4xl font-bold">E-Mail-Verifizierung</h1>

	{#if data.userVerified}
		<Alert.Root>
			<CheckCircle2Icon />
			<Alert.Title>Du hast dich erfolgreich verifiziert</Alert.Title>
		</Alert.Root>
		<Button href="/targets">Weiter</Button>
	{:else if data.currentRequest || data.newRequest}
		<p>
			Du hast eine E-Mail zur Verifizierung erhalten. Bitte überprüfe dein Postfach und deinen
			Spam-Ordner.
		</p>
		{#if form?.resent}
			<Alert.Root>
				<AlertCircleIcon />
				<Alert.Title>Verifizierungs-E-Mail wurde erneut versendet!</Alert.Title>
			</Alert.Root>
		{/if}
		<form action="?/resend" method="post" use:enhance>
			<Button type="submit">Erneut senden</Button>
		</form>
	{/if}
</div>

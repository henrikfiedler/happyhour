<script lang="ts">
	import { enhance } from '$app/forms';
	import TargetForm from '$lib/components/forms/target-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';
	import * as Dialog from '$lib/components/ui/dialog';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';

	let { data }: { data: PageData } = $props();

	let dialogOpen = $state(false);
	let deleteSubmitting = $state(false);
</script>

<TargetForm rawForm={data.form} resetForm={false}></TargetForm>

<Separator class="my-5"></Separator>

<Button class="mb-2" variant="destructive" onclick={() => (dialogOpen = !dialogOpen)}>
	Ziel Löschen
</Button>

<Dialog.Root bind:open={dialogOpen}>
	<!-- <Dialog.Trigger>Open</Dialog.Trigger> -->
	<Dialog.Content>
		<form
			action="?/delete"
			method="post"
			use:enhance={() => {
				deleteSubmitting = true;
				return async ({ update, result }) => {
					await update();
					if (result.type === 'success') {
						dialogOpen = false;
						deleteSubmitting = false;
					}
				};
			}}
		>
			<Dialog.Header>
				<Dialog.Title>Ziel wirklich löschen?</Dialog.Title>
				<Dialog.Description />
			</Dialog.Header>
			<p></p>
			<Dialog.Footer>
				<Button type="submit" variant="destructive" disabled={deleteSubmitting}>
					{#if deleteSubmitting}
						<LoaderCircle class="animate-spin" />
					{/if}
					Löschen
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

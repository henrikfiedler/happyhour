<script lang="ts">
	import TargetTableComponent from '$lib/components/TargetTableComponent.svelte';
	import type { PageData } from './$types';
	import TargetForm from '$lib/components/forms/target-form.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { targetInsertSchema } from '$lib/schemas';
	import { Separator } from '$lib/components/ui/separator';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(targetInsertSchema)
	});

	const { form: formData, enhance } = form;
</script>

<TargetTableComponent targets={data.targets} favoriteTargetId={data.favoriteTargetId} />

<Separator class="my-10" />

<h2 class="mb-4 text-2xl font-bold">Neues Ziel erstellen</h2>

<TargetForm rawForm={data.form}></TargetForm>

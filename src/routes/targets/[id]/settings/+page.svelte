<script lang="ts">
	import { enhance } from '$app/forms';
	import TargetForm from '$lib/components/forms/target-form.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<TargetForm rawForm={data.form}></TargetForm>

<Separator class="my-5"></Separator>

<form action="?/delete" method="post" use:enhance>
	<Button type="submit" name="targetId" value={data.target.id} variant="destructive">
		Löschen
	</Button>
</form>

<script lang="ts">
	import TargetForm from '$lib/components/forms/TargetForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<TargetForm rawForm={data.form}></TargetForm>

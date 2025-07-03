<script lang="ts">
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="grid grid-cols-1 gap-3">
	<h1 class="text-4xl">Account</h1>

	<p>Email: {data.userData.email}</p>

	<p>Erstellt am: <LocalDateComponent date={data.userData.createdAt}></LocalDateComponent></p>
</div>

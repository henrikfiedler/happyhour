<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>User</h1>

{#if data.user}
	<p>E-Mail: {data.user.email}</p>

	<form method="post" use:enhance>
		<Button type="submit">Logout</Button>
	</form>
{:else}
	<p>You are not logged in.</p>
{/if}

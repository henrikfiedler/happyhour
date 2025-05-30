<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1>User</h1>

<!-- {#if data.user}
	<p>E-Mail: {data.user.email}</p>
	<p>Name: {data.user.name}</p>
{:else}
	<p>You are not logged in.</p>
{/if} -->

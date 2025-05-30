<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<p>
	Start: {data.target?.startDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}
</p>

<script lang="ts">
	import TargetTableComponent from '$lib/components/TargetTableComponent.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<TargetTableComponent targets={data.targets} />

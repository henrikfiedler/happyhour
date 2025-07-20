<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import type { User } from '$lib/types';
	import LocalDateComponent from '$lib/components/local-date-component.svelte';
	import CircleCheck from '@lucide/svelte/icons/circle-check';

	type AdminUserResult = Pick<User, 'email' | 'emailVerified' | 'createdAt'>;

	let { users }: { users: AdminUserResult[] } = $props();
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head></Table.Head>
			<Table.Head>E-Mail</Table.Head>
			<Table.Head class="hidden sm:table-cell">Erstellt</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each users as user (user)}
			<Table.Row>
				<Table.Cell>
					{#if user.emailVerified}
						<CircleCheck></CircleCheck>
					{/if}
				</Table.Cell>
				<Table.Cell>
					{user.email}
				</Table.Cell>
				<Table.Cell class="hidden sm:table-cell">
					<LocalDateComponent date={user.createdAt} />
				</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

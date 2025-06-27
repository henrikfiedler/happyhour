<script lang="ts">
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BellIcon from '@lucide/svelte/icons/bell';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';

	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import type { TNavUser, User, AuthUser } from '$lib/types';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';

	let { user }: { user: AuthUser | null } = $props();

	const sidebar = useSidebar();
</script>

{#snippet navUser(u: AuthUser)}
	<Avatar.Root class="size-8 rounded-lg">
		<!-- <Avatar.Image src={user.avatar} alt={u.name} /> -->
		<Avatar.Fallback class="rounded-lg"><!-- CN --></Avatar.Fallback>
	</Avatar.Root>
	<div class="grid flex-1 text-left text-sm leading-tight">
		<!-- <span class="truncate font-medium">{u.name}</span> -->
		<span class="truncate text-xs">{u.email}</span>
	</div>
{/snippet}

<Sidebar.Menu>
	<Sidebar.MenuItem>
		{#if !user}
			<div class="grid gap-2">
				<Button href="/login" size="lg">Login</Button>
				<Button href="/register" size="lg" variant="outline">Register</Button>
			</div>
			<!-- <Sidebar.MenuButton
				href="/register"
				size="lg"
				class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				Register
			</Sidebar.MenuButton> -->
		{:else}
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Sidebar.MenuButton
							{...props}
							size="lg"
							class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{@render navUser(user)}
							<ChevronsUpDownIcon class="ml-auto size-4" />
						</Sidebar.MenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
					side={sidebar.isMobile ? 'bottom' : 'right'}
					align="end"
					sideOffset={4}
				>
					<DropdownMenu.Label class="p-0 font-normal">
						<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
							{@render navUser(user)}
						</div>
					</DropdownMenu.Label>
					<!-- <DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<SparklesIcon />
							Upgrade to Pro
						</DropdownMenu.Item>
					</DropdownMenu.Group> -->
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<BadgeCheckIcon />
							<a href="/account">Account</a>
						</DropdownMenu.Item>
						<!-- <DropdownMenu.Item>
							<CreditCardIcon />
							Billing
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<BellIcon />
							Notifications
						</DropdownMenu.Item> -->
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<form action="/logout" method="post" use:enhance>
						<DropdownMenu.Item>
							<LogOutIcon />
							<Button type="submit" variant="ghost">Log out</Button>
						</DropdownMenu.Item>
					</form>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		{/if}
	</Sidebar.MenuItem>
</Sidebar.Menu>

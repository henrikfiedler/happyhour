<script lang="ts" module>
	import BookOpenIcon from '@lucide/svelte/icons/book-open';
	import BotIcon from '@lucide/svelte/icons/bot';
	import JoyStick from '@lucide/svelte/icons/joystick';
	import SquareTerminalIcon from '@lucide/svelte/icons/square-terminal';
</script>

<script lang="ts">
	import NavMain from './nav-main.svelte';
	import NavProjects from './nav-projects.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import NavUser from './nav-user.svelte';
	import type { AuthUser, NavItem, TNavUser, User } from '$lib/types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import CommandIcon from '@lucide/svelte/icons/command';
	import type { ComponentProps } from 'svelte';
	import { page } from '$app/state';
	import NavSettings from './nav-settings.svelte';
	import { Separator } from '../ui/separator';
	import { buildPath } from '$lib/utils';

	type NavData = {
		navMain: /* {
			title: string;
			url: string;
			icon: any; // Lucide icon component
			isActive?: boolean;
			items?: { title: string; url: string }[];
		} */ NavItem[];
		navSettings: /* {
			title: string;
			url: string;
			icon: any; // Lucide icon component
			items?: { title: string; url: string }[];
		} */ NavItem[];
	};

	let {
		ref = $bindable(null),
		data,
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { data: NavData } & { user: AuthUser | null } = $props();

	const sampleData = {
		user: {
			// name: "shadcn",
			email: 'm@example.com',
			avatar: '/avatars/shadcn.jpg'
		},
		/* navMain: [
			{
				title: "Playground",
				url: "#",
				icon: SquareTerminalIcon,
				isActive: true,
				items: [
					{
						title: "History",
						url: "#",
					},
					{
						title: "Starred",
						url: "#",
					},
					{
						title: "Settings",
						url: "#",
					},
				],
			},
			{
				title: "Models",
				url: "#",
				icon: BotIcon,
				items: [
					{
						title: "Genesis",
						url: "#",
					},
					{
						title: "Explorer",
						url: "#",
					},
					{
						title: "Quantum",
						url: "#",
					},
				],
			},
			{
				title: "Documentation",
				url: "#",
				icon: BookOpenIcon,
				items: [
					{
						title: "Introduction",
						url: "#",
					},
					{
						title: "Get Started",
						url: "#",
					},
					{
						title: "Tutorials",
						url: "#",
					},
					{
						title: "Changelog",
						url: "#",
					},
				],
			},
			{
				title: "Settings",
				url: "#",
				icon: Settings2Icon,
				items: [
					{
						title: "General",
						url: "#",
					},
					{
						title: "Team",
						url: "#",
					},
					{
						title: "Billing",
						url: "#",
					},
					{
						title: "Limits",
						url: "#",
					},
				],
			},
		], */
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: SquareTerminalIcon,
				isActive: true
			},
			{
				title: 'Ziele',
				url: 'targets',
				icon: BotIcon
			},
			{
				title: 'Aktuelles Ziel',
				url: '/targets/abc',
				icon: BookOpenIcon,
				items: [
					{
						title: 'Analytics',
						url: '/targets/abc/analytics'
					},
					{
						title: 'Leistungen',
						url: '/targets/abc/entries'
					},
					{
						title: 'Einstellungen',
						url: '/targets/abc/settings'
					}
				]
			},
			{
				title: 'Feiertage',
				url: '/holidays',
				icon: BotIcon
			},
			{
				title: 'Urlaub',
				url: '/vacations',
				icon: BotIcon
			},
			{
				title: 'Krankheit',
				url: '/sickness',
				icon: BotIcon
			}
		]
		/* navSecondary: [
			{
				title: 'Support',
				url: '#',
				icon: LifeBuoyIcon
			},
			{
				title: 'Feedback',
				url: '#',
				icon: SendIcon
			}
		], */
		/* projects: [
			{
				name: 'Design Engineering',
				url: '#',
				icon: FrameIcon
			},
			{
				name: 'Sales & Marketing',
				url: '#',
				icon: ChartPieIcon
			},
			{
				name: 'Travel',
				url: '#',
				icon: MapIcon
			}
		] */
	};

	const demoNav = [
		(() => {
			return buildPath({
				title: 'Demo',
				url: '/',
				icon: JoyStick,
				activeType: 'exact'
			});
		})()
	];
</script>

<Sidebar.Root bind:ref variant="sidebar" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton size="lg">
					{#snippet child({ props })}
						<a href="/" {...props}>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<CommandIcon class="size-4" />
							</div>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-medium">HappyHour</span>
							</div>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		{#if user}
			<NavMain items={data.navMain} />
			<!-- <NavSettings items={data.navSettings} /> -->
			<!-- <NavProjects projects={data.projects} /> -->
			<!-- <NavSecondary items={data.navSecondary} class="mt-auto" /> -->
		{:else}
			<NavMain items={demoNav}></NavMain>
		{/if}
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
		<div class="flex flex-col items-center">
			<div class="flex flex-row gap-2">
				<a class="text-muted-foreground text-xs" href="/imprint">Impressum</a>
				<Separator orientation="vertical"></Separator>
				<a class="text-muted-foreground text-xs" href="/privacy-policy">Datenschutz</a>
			</div>
			<div class="text-muted-foreground text-xs">
				by <a class="underline" href="https://henrikfiedler.de" target="_blank">Henrik Fiedler</a>
			</div>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>

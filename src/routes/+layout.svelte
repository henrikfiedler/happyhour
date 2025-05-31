<script lang="ts">
	import '../app.css';
	import AppSidebar from '$lib/components/navigation/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import BotIcon from '@lucide/svelte/icons/bot';

	let { children } = $props();

	const user = {
		// name: "shadcn",
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg'
	};

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '/dashboard',
				icon: BotIcon,
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
				icon: BotIcon,
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
			}
		],
		navSettings: [
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
	};
</script>

<Sidebar.Provider>
	<AppSidebar {data} {user} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						<Breadcrumb.Item class="hidden md:block">
							<Breadcrumb.Link href="#">Building Your Application</Breadcrumb.Link>
						</Breadcrumb.Item>
						<Breadcrumb.Separator class="hidden md:block" />
						<Breadcrumb.Item>
							<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
						</Breadcrumb.Item>
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="@container/main px-4">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

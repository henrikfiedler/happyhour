<script lang="ts">
	import '../app.css';
	import AppSidebar from '$lib/components/navigation/app-sidebar.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import BotIcon from '@lucide/svelte/icons/bot';
	import Target from '@lucide/svelte/icons/target';
	import Star from '@lucide/svelte/icons/star';
	import List from '@lucide/svelte/icons/list';
	import CalendarCog from '@lucide/svelte/icons/calendar-cog';
	import Pill from '@lucide/svelte/icons/pill';
	import Plane from '@lucide/svelte/icons/plane';
	import House from '@lucide/svelte/icons/house';

	import type { LayoutProps } from './$types';
	import { is } from 'drizzle-orm';
	import { page } from '$app/state';
	import type { NavActiveType, NavBuildItem, NavItem } from '$lib/types';

	let { data, children }: LayoutProps = $props();

	function buildPath(item: NavBuildItem): NavItem {
		return {
			title: item.title,
			url: item.url,
			icon: item.icon,
			isActive: checkPathActive(item.url, item.activeType),
			items: item.items?.map(buildPath) ?? []
		};
	}

	function checkPathActive(path: string, type: NavActiveType = 'include'): boolean {
		switch (type) {
			case 'exact':
				return page.url.pathname === path;
			case 'include':
				return page.url.pathname.includes(path);
			default:
				return page.url.pathname.includes(path);
		}
	}

	let navData = $derived({
		navMain: [
			/* (() => {
				return buildPath({
					title: 'Dashboard',
					url: '/dashboard',
					icon: BotIcon
				});
			})(), */

			(() => {
				return buildPath({
					title: 'Ziele',
					url: '/targets',
					icon: Target,
					activeType: 'exact'
				});
			})(),
			...(data.currentTarget
				? [
						(() => {
							return buildPath({
								title: data.currentTarget!.description,
								url: `/targets/${data.currentTarget!.id}`,
								icon: Star,
								items: [
									/* {
										title: 'Analytics',
										url: `/targets/${data.currentTarget!.id}/analytics`,
										icon: BotIcon
									}, */
									{
										title: 'Leistungen',
										url: `/targets/${data.currentTarget!.id}/entries`,
										icon: List
									},
									{
										title: 'Einstellungen',
										url: `/targets/${data.currentTarget.id}/settings`,
										icon: BotIcon
									}
								]
							});
						})()
					]
				: []),
			(() => {
				return buildPath({
					title: 'Feiertage',
					url: '/holidays',
					icon: CalendarCog,
					activeType: 'exact'
				});
			})(),
			(() => {
				return buildPath({
					title: 'Abwesenheit',
					url: '/absences',
					icon: House,
					activeType: 'exact'
				});
			})()
			/* (() => {
				return buildPath({
					title: 'Urlaub',
					url: '/vacations',
					icon: Plane,
					activeType: 'exact'
				});
			})(),
			(() => {
				return buildPath({
					title: 'Krankheit',
					url: '/sickness',
					icon: Pill,
					activeType: 'exact'
				});
			})() */
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
	});

	let primaryNav = $derived(navData.navMain.find((item) => item.isActive));
	let secondaryNav = $derived(primaryNav?.items?.find((item) => item.isActive));
</script>

<Sidebar.Provider>
	<AppSidebar data={navData} user={data.user} />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2">
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 data-[orientation=vertical]:h-4" />
				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#if primaryNav && secondaryNav}
							<Breadcrumb.Item class="hidden md:block">
								<Breadcrumb.Link
									class="block max-w-50 truncate md:max-w-full"
									href={primaryNav.url}
								>
									{primaryNav.title}
								</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator class="hidden md:block" />
							<Breadcrumb.Item>
								<Breadcrumb.Page>{secondaryNav.title}</Breadcrumb.Page>
							</Breadcrumb.Item>
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Page class="block max-w-50 truncate md:max-w-full">
									{primaryNav?.title ?? 'HappyHour'}
								</Breadcrumb.Page>
							</Breadcrumb.Item>
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>
		<div class="@container/main px-4">
			{@render children()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>

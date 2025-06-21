import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { NavActiveType, NavBuildItem, NavItem } from "./types";
import { page } from "$app/state";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };



export const delay = (ms: number = 2000) => new Promise((resolve) => setTimeout(resolve, ms));

export function buildPath(item: NavBuildItem): NavItem {
	return {
		title: item.title,
		url: item.url,
		icon: item.icon,
		isActive: checkPathActive(item.url, item.activeType),
		items: item.items?.map(buildPath) ?? []
	};
}

export function checkPathActive(path: string, type: NavActiveType = 'include'): boolean {
	switch (type) {
		case 'exact':
			return page.url.pathname === path;
		case 'include':
			return page.url.pathname.includes(path);
		default:
			return page.url.pathname.includes(path);
	}
}
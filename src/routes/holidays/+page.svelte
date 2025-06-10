<script lang="ts">
	import { holidaySchema } from '$lib/schemas';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import Holidays, { type HolidaysTypes } from 'date-holidays';

	let { data }: { data: PageData } = $props();

	const form = superForm(data.form, {
		validators: zodClient(holidaySchema),
		resetForm: false
	});

	const { form: formData, enhance } = form;

	type CountryType = { value: string; label: string; sortIndex: number };
	type StateRegionType = { value: string; label: string };

	function isPrefferedCountry(country: string) {
		const prefferedCountries = ['DE', 'CH', 'AT', 'US'];
		return prefferedCountries.reverse().findIndex((e) => e === country);
	}

	const hd = new Holidays();
	const countries: CountryType[] = Object.entries(hd.getCountries())
		.map(
			(e) =>
				<CountryType>{
					value: e[0],
					label: e[1],
					sortIndex: isPrefferedCountry(e[0])
				}
		)
		.sort((a, b) => b.sortIndex - a.sortIndex);

	let states: StateRegionType[] = $derived(
		$formData.country
			? Object.entries(hd.getStates($formData.country)).map(
					(e) =>
						<StateRegionType>{
							value: e[0],
							label: e[1]
						}
				)
			: []
	);

	let regions: StateRegionType[] = $derived(
		$formData.country && $formData.state
			? Object.entries(hd.getRegions($formData.country, $formData.state) ?? []).map(
					(e) =>
						<StateRegionType>{
							value: e[0],
							label: e[1]
						}
				)
			: []
	);
</script>

<form method="POST" use:enhance>
	<div class="grid gap-3 sm:grid-cols-3">
		<Form.Field {form} name="country">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Land</Form.Label>
					<Select.Root type="single" bind:value={$formData.country} name={props.name}>
						<Select.Trigger {...props}>
							{$formData.country
								? countries.find((e) => e.value === $formData.country)?.label
								: 'Wähle ein Land aus'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value={''} label={'Leer'} />
							{#each countries as { value, label }}
								<Select.Item {value} {label} />
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="state">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Staat</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.state}
						disabled={!states.length}
						name={props.name}
					>
						<Select.Trigger {...props}>
							{!states.length
								? 'Wähle zunächst ein Land aus'
								: $formData.state
									? states.find((e) => e.value === $formData.state)?.label
									: 'Wähle einen Staat aus'}
						</Select.Trigger>
						<Select.Content>
							{#each states as { value, label }}
								<Select.Item {value} {label} />
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="region">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Region</Form.Label>
					<Select.Root
						type="single"
						bind:value={$formData.region}
						disabled={!regions.length}
						name={props.name}
					>
						<Select.Trigger class="truncate" {...props}>
							{$formData.state && !regions.length
								? 'Keine Regionen zur Auswahl'
								: $formData.region && regions.find((e) => e.value === $formData.region)
									? regions.find((e) => e.value === $formData.region)?.label
									: 'Wähle eine Region aus'}
						</Select.Trigger>
						<Select.Content>
							{#if regions.length}
								<Select.Item value={''} label={'Leer'} />
							{/if}
							{#each regions as { value, label }}
								<Select.Item {value} {label} />
							{/each}
						</Select.Content>
					</Select.Root>
				{/snippet}
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
	</div>

	<Form.Button type="submit">Speichern</Form.Button>
</form>

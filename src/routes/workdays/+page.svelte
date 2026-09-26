<script lang="ts">
    import type { PageData } from './$types';
    import { dateProxy, superForm } from 'sveltekit-superforms';
    import { zod4Client } from 'sveltekit-superforms/adapters';
    import { workdayInsertSchema } from '$lib/schemas';
    import { workdayTypesArray } from '$lib/types';
    import * as Form from '$lib/components/ui/form';
    import * as Select from '$lib/components/ui/select';
    import { Input } from '$lib/components/ui/input';
    import { Button } from '$lib/components/ui/button';
    import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
    import SubmitButton from '$lib/components/forms/submit-button.svelte';
    import WorkdayDataTable from '$lib/components/workday-data-table.svelte';

    let { data }: { data: PageData } = $props();

    const form = superForm(data.form, {
        validators: zod4Client(workdayInsertSchema),
        resetForm: false
    });

    const { form: formData, enhance, submitting } = form;
    const date = dateProxy(form, 'date', { format: 'date' });
</script>

<form class="mb-8" action="?/save" method="post" use:enhance>
    <div class="grid gap-2 sm:grid-cols-[12rem_12rem]">
        <Form.Field {form} name="date">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Datum</Form.Label>
                    <Input type="date" {...props} bind:value={$date} />
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="type">
            <Form.Control>
                {#snippet children({ props })}
                    <Form.Label>Arbeitsort</Form.Label>
                    <Select.Root type="single" bind:value={$formData.type} name={props.name}>
                    <Select.Trigger {...props} class="w-full">
                            {workdayTypesArray.find((workday) => workday.value === $formData.type)?.label}
                        </Select.Trigger>
                        <Select.Content>
                            {#each workdayTypesArray as { value, label }}
                                <Select.Item {value} {label} />
                            {/each}
                        </Select.Content>
                    </Select.Root>
                {/snippet}
            </Form.Control>
            <Form.FieldErrors />
        </Form.Field>
    </div>

    <SubmitButton {submitting}>Hinzufügen</SubmitButton>
</form>

<form class="mb-6" method="get">
    <div class="grid items-end gap-2 sm:grid-cols-[12rem_12rem_auto]">
        <div class="space-y-2">
            <label for="from" class="text-sm font-medium">Von</label>
            <Input
                id="from"
                name="from"
                type="date"
                value={data.filters.from}
                onchange={(event) => event.currentTarget.form?.requestSubmit()}
            />
        </div>
        <div class="space-y-2">
            <label for="to" class="text-sm font-medium">Bis</label>
            <Input
                id="to"
                name="to"
                type="date"
                value={data.filters.to}
                onchange={(event) => event.currentTarget.form?.requestSubmit()}
            />
        </div>
        <Button
            href="/workdays"
            variant="ghost"
            size="sm"
            class="justify-self-start text-muted-foreground"
        >
            <RotateCcw />
            Zurücksetzen
        </Button>
    </div>
</form>

<div class="mb-6 grid gap-3 sm:grid-cols-3">
    {#each workdayTypesArray as workday}
        <div class="rounded-md border p-4">
            <p class="text-sm text-muted-foreground">{workday.label}</p>
            <p class="text-2xl font-semibold">{data.workdayCounts[workday.value]}</p>
        </div>
    {/each}
</div>

<WorkdayDataTable workdays={data.workdays} />

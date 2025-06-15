<script lang="ts">
	type DateVariant = 'date' | 'withWeekdayShort' | 'withWeekdayLong';

	let { date, variant = 'date' }: { date: Date; variant?: DateVariant } = $props();

	let options: Intl.DateTimeFormatOptions = $state({ dateStyle: 'medium' });

	switch (variant) {
		case 'withWeekdayLong':
			options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
			break;
		case 'withWeekdayShort':
			options = { weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit' };
			break;
		case 'date':
			options = { dateStyle: 'medium' };
			break;
		default:
			options = { dateStyle: 'medium' };
			break;
	}
</script>

{date?.toLocaleDateString(undefined, options)}

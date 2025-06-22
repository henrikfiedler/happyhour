<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { EmailVerification } from '$lib/types';

	interface Props {
		token: EmailVerification['id'];
	}

	let { token }: Props = $props();
</script>

<p>Hi,</p>

<p>Bitte bestätige deine E-Mail-Adresse, indem du auf den folgenden Link klickst:</p>

<p>
	<a href="{PUBLIC_BASE_URL}/email-verification?token={token}"> E-Mail bestätigen </a>
</p>

<p>Vielen Dank!</p>

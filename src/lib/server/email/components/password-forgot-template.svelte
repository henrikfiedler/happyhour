<script lang="ts">
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import type { PasswordForgot } from '$lib/types';

	interface Props {
		token: PasswordForgot['id'];
	}

	let { token }: Props = $props();
</script>

<p>Hi,</p>

<p>Setze dein Passwort zurück, indem du auf den folgenden Link klickst:</p>

<p>
	<a href="{PUBLIC_BASE_URL}/password-forgot?token={token}"> Passwort zurücksetzen </a>
</p>

<p>Vielen Dank!</p>

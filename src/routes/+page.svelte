<script lang="ts">
	import '../app.css'; 
	import { onMount } from 'svelte';
	import GameDisplay from '$lib/GameDisplay.svelte';
	import GhLink from '$lib/GhLink.svelte';
	import PageControls from '$lib/PageControls.svelte';

	onMount(() => {
		const share = document.getElementById("share");
		const shareData = {
			title: "JSlauncher",
			text: "Minecraft Launcher",
			url: "https://classic-hopetowork.netlify.app/"
		};
		if (navigator.canShare?.(shareData)) {
			share.addEventListener("click", () => navigator.share(shareData));
			share.style.display = 'unset';
		}
 	});
</script>

<header>
	<h1>MineCraft</h1>
	<div>
		<GameDisplay />
		<PageControls />
	</div>
	<GhLink />
</header>
<main>

</main>

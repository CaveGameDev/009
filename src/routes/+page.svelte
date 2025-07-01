<script lang="ts">
	import '../app.css'; 
	import { onMount } from 'svelte';
	import GameDisplay from '$lib/GameDisplay.svelte';
	

	onMount(() => {
		const share = document.getElementById("share");
		const shareData = {
			title: "JSlauncher",
			text: "Minecraft Launcher"
		};
		if (navigator.canShare?.(shareData)) {
			share.addEventListener("click", () => navigator.share(shareData));
			share.style.display = 'unset';
		}
 	});
</script>

<header>
	<h1>Alpha 1.0-2 (InfDev)</h1>
        <h2>Both a1.0-1 and a1.0-2 are broken at this moment.<h2>
	<div>
		<GameDisplay />
	</div>
</header>
<main>

</main>

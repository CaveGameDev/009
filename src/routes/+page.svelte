<script lang="ts">
	import '../app.css'; 
	import { onMount } from 'svelte';
	import GameDisplay from '$lib/GameDisplay.svelte';
	

	onMount(() => {
		const share = document.getElementById("share");
		const shareData = {
			title: "JSlauncher",
			text: "Minecraft Launcher",
			url: "https://Beta-1.netlify.app/"
		};
		if (navigator.canShare?.(shareData)) {
			share.addEventListener("click", () => navigator.share(shareData));
			share.style.display = 'unset';
		}
 	});
</script>

<header>
	<h1>Alpha 1.2.4_01</h1>
	<div>
		<GameDisplay />
	</div>
</header>
<main>

</main>

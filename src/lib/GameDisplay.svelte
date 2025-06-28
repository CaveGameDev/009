<script lang="ts">
	import { onMount } from 'svelte';
	import { tryPlausible, showElement, hideElement } from "./utilities";

	// --- MeoWrapper & Minecraft Launch Configuration ---

	// Path to the MeoWrapper JAR in your /app/ directory
	const pathJarMeoWrapper = "/app/meowrapper.jar";

	// The specific Minecraft version MeoWrapper should download and launch
	const minecraftVersion = "1.8.9";

	// Important: MeoWrapper will download all necessary Minecraft JARs and libraries
	// (like the actual 1.8.9.jar, Guava, Authlib, etc.) into the specified --run-dir.
	// You no longer need to list them individually in the classpath here.

	// Your existing display and intro elements
	let display: HTMLDivElement;
	let intro: HTMLDivElement;

	async function startCheerpJ() {
		await cheerpjInit({
			version: 8, // Set CheerpJ version to 8, suitable for Minecraft 1.8.9
			// These Java properties and libraries are for CheerpJ's internal native emulation
			// (specifically for LWJGL), not directly managed by MeoWrapper.
			javaProperties: ["java.library.path=/app/lwjgl/libraries/"], // Path to native DLLs for LWJGL
			libraries: {"libGL.so.1": "/app/lwjgl/libraries/gl4es.wasm"},
			enableX11:true, // Enable X11 for graphical output

			// Preload resources for Java 8 runtime.
			// Now, we only need to explicitly preload MeoWrapper's JAR,
			// as it handles the rest of Minecraft's dependencies.
			preloadResources:{
                "/lt/8/jre/lib/rt.jar":[0,131072,1310720,1572864,4456448,4849664,5111808,5505024,7995392,8126464,9699328,9830400,9961472,11534336,11665408,12189696,12320768,12582912,13238272,13369344,15073280,15335424,15466496,15597568,15990784,16121856,16252928,16384000,16777216,16908288,17039360,17563648,17694720,17825792,17956864,18087936,18219008,18612224,18743296,18874368,19005440,19136512,19398656,19791872,20054016,20709376,20840448,21757952,21889024,26869760],
                "/lt/etc/users":[0,131072],"/lt/etc/localtime":[],
                "/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],
                "/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],
                "/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],
                "/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],
                "/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],
                "/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],
                "/lt/8/lib/ext/sunjce_provider.jar":[],
                "/lt/8/lib/security/java.security":[0,131072],
                "/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/jre/lib":[],
                "/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],
                "/lt/8/lib/currency.data":[0,131072],"/lt/8/lib/currency.properties":[],
                "/lt/libraries/libGLESv2.so.1":[0,262144],"/lt/libraries/libEGL.so.1":[0,262144],
                "/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/etc/hosts":[],"/lt/etc/resolv.conf":[0,131072],
                "/lt/8/lib/fonts/fallback":[],
                "/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/ttf":[],
                "/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],
                "/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],
                "/lt/8/lib/jaxp.properties":[],"/lt/etc/timezone":[],
                "/lt/8/lib/tzdb.dat":[0,131072],
                // MeoWrapper's JAR is the only application-specific JAR we preload now
                [pathJarMeoWrapper]: []
            }
		});

		// Create the CheerpJ display area
		await cheerpjCreateDisplay(-1, -1, display);
	}

	async function startGame() {
		hideElement(intro); // Hide the intro screen
		showElement(display); // Show the CheerpJ display area

		await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI update

		tryPlausible("Play"); // Optional: for analytics

		// --- Launch Minecraft using MeoWrapper ---
		// Main class: MeoWrapper's own entry point
		// Classpath: Only MeoWrapper's JAR (it handles the rest)
		// Arguments: MeoWrapper-specific commands
		await cheerpjRunMain(
			"io.github.lgatodu47.meowrapper.MeoWrapper", // MeoWrapper's main class
			pathJarMeoWrapper, // MeoWrapper's JAR is its own classpath
			"--run-dir", "/files/minecraft_home", // IMPORTANT: MeoWrapper will download Minecraft files here. /files/ uses browser's IndexedDB for persistence.
			"client", // Tell MeoWrapper to run in client (game) mode
			"--version", minecraftVersion, // Specify the Minecraft version (e.g., "1.8.9")
			"--username", "CheerPJPlayer" // Set the player's in-game username
			// Optional arguments for MeoWrapper:
			// "--offline" // Use this if you encounter authentication issues, will launch in offline mode
			// "--debug" // For more verbose output from MeoWrapper
		);
	}

	// Svelte's onMount lifecycle hook: runs when the component is first added to the DOM
	onMount(async () => {
		// Get references to HTML elements (add type assertions for TypeScript)
		display = document.getElementById('display') as HTMLDivElement;
		intro = document.getElementById('intro') as HTMLDivElement;

		// Initialize CheerpJ when the component mounts
		startCheerpJ();
	});
</script>

<div class="game-container">
	<div id="intro" class="intro">
		<p>
			This is Minecraft running unmodified in the browser.
		</p>
		<p>
			Clicking the button below will start the game.
		</p>
		<button on:click={startGame}>Play!</button>
		<div class="disclaimer">
			This is not an official Minecraft product. It is not approved by or associated with Mojang or Microsoft.
		</div>
	</div>
	<div id="display" class="display"></div>
</div>

<style>
	.game-container {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #333; /* Dark background for game container */
		position: relative;
		overflow: hidden; /* Prevent scrollbars */
	}

	.intro {
		text-align: center;
		color: #fff;
		padding: 20px;
		background-color: rgba(0, 0, 0, 0.7);
		border-radius: 8px;
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
		display: flex;
		flex-direction: column;
		gap: 15px;
		max-width: 500px;
		margin: auto;
	}

	.intro p {
		margin: 0;
		font-size: 1.1em;
	}

	.intro button {
		padding: 12px 25px;
		font-size: 1.2em;
		background-color: #4CAF50;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.intro button:hover {
		background-color: #45a049;
	}

	.disclaimer {
		font-size: 0.8em;
		color: #bbb;
		margin-top: 15px;
	}

	.display {
		width: 100%;
		height: 100%;
		/* The display element needs to be visible for cheerpjCreateDisplay to work */
		/* but it will be hidden by default and shown by startGame() */
		display: none; /* Initially hidden */
	}
</style>

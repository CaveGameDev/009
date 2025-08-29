<script lang="ts">
	import { onMount } from 'svelte';
	// Removed utilities import as no longer needed for hideElement, showElement, tryPlausible.

	// --- Minecraft Launch Configuration ---

	// Main Minecraft client JAR file path
	const pathJarMinecraft = "/app/client_modernized.jar";

	// LaunchWrapper main JAR file path
	const pathJarLaunchWrapper = "/app/launchwrapper-1.6.jar";

	// Combined classpath string including all necessary JARs for LaunchWrapper and Minecraft.
	// This includes LWJGL, ASM, and JOpt Simple JARs.
	// Note: Log4j API and Core JARs were previously removed to diagnose UnsatisfiedLinkError.
	const pathJarLibs = `${pathJarLaunchWrapper}:/app/asm-all-4.1.jar:/app/jopt-simple-4.5.jar:/app/lwjgl/lwjgl-2.9.3.jar:/app/lwjgl/lwjgl_util-2.9.3.jar:${pathJarMinecraft}`;

	let display: HTMLDivElement; // Reference to the HTML element where the game will be displayed

	/**
	 * Initializes CheerpJ with the specified configuration.
	 * This function sets up the Java runtime environment.
	 */
	async function startCheerpJ() {
		// Assume `cheerpjInit` is globally available from the CheerpJ library.
		await cheerpjInit({
			version: 8, // Set CheerpJ version to 8 for Minecraft compatibility
			javaProperties: ["java.library.path=/app/lwjgl/libraries/"], // Path to native DLLs for LWJGL
			libraries: {"libGL.so.1": "/app/lwjgl/libraries/gl4es.wasm"}, // Mapping a native library to a WebAssembly module
			enableX11: true, // Enables X11 support for graphical output
			// Preload resources for Java 8 runtime to optimize loading times.
			// This is a comprehensive list of typical JARs and configuration files.
			preloadResources:{"/lt/8/jre/lib/rt.jar":[0,131072,1310720,1572864,4456448,4849664,5111808,5505024,7995392,8126464,9699328,9830400,9961472,11534336,11665408,12189696,12320768,12582912,13238272,13369344,15073280,15335424,15466496,15597568,15990784,16121856,16252928,16384000,16777216,16908288,17039360,17563648,17694720,17825792,17956864,18087936,18219008,18612224,18743296,18874368,19005440,19136512,19398656,19791872,20054016,20709376,20840448,21757952,21889024,26869760],"/lt/etc/users":[0,131072],"/lt/etc/localtime":[],"/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],"/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],"/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],"/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],"/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],"/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],"/lt/8/lib/ext/sunjce_provider.jar":[],"/lt/8/lib/security/java.security":[0,131072],"/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/jre/lib":[],"/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],"/lt/8/lib/currency.data":[0,131072],"/lt/8/lib/currency.properties":[],"/lt/libraries/libGLESv2.so.1":[0,262144],"/lt/libraries/libEGL.so.1":[0,262144],"/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/etc/hosts":[],"/lt/etc/resolv.conf":[0,131072],"/lt/8/lib/fonts/fallback":[],"/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/ttf":[],"/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],"/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],"/lt/8/lib/jaxp.properties":[],"/lt/etc/timezone":[],"/lt/8/lib/tzdb.dat":[0,131072]}
		});

		// Assume `cheerpjCreateDisplay` is globally available.
		// The -1, -1 arguments indicate that CheerpJ should determine the display size,
		// but our CSS will enforce the container size.
		await cheerpjCreateDisplay(-1, -1, display);
	}

	/**
	 * Starts the Minecraft game using the CheerpJ runtime.
	 * This function is now called automatically when the component mounts.
	 */
	async function startGame() {
		await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for display readiness

		// Assume `cheerpjRunMain` is globally available.
		// Use net.minecraft.launchwrapper.Launch as the main class,
		// and pass the tweakClass as a program argument for Minecraft.
		await cheerpjRunMain(
			"net.minecraft.launchwrapper.Launch",
			pathJarLibs,
			"--tweakClass", "net.minecraft.launchwrapper.AlphaVanillaTweaker",
			"--username", "Player"
		);
	}

	// Svelte's onMount lifecycle hook, executed when the component is first rendered to the DOM.
	onMount(async () => {
		// Get a reference to the 'display' div
		display = document.getElementById('display') as HTMLDivElement;

		// Initialize CheerpJ and then immediately start the game
		await startCheerpJ();
		await startGame();
	});
</script>

<div class="game-container">
	<!-- The CheerpJ canvas will be rendered inside this div. -->
	<div id="display"></div>
</div>

<style>
	/* Ensures the body takes full viewport height and centers content */
	body {
		margin: 0;
		overflow: hidden; /* Prevents scrollbars */
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 100vh;
		background-color: #1a202c; /* Dark background */
		font-family: 'Inter', sans-serif;
		color: #e2e8f0;
	}

	/* Defines the fixed size and styling for the game display area */
	.game-container {
		width: 854px; /* Explicitly set width */
		height: 480px; /* Explicitly set height */
		overflow: hidden; /* Hides any content that overflows this fixed area */
		border-radius: 0.5rem; /* Softly rounded corners */
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Subtle shadow */
	}

	/* Ensures the display div itself fills its container */
	#display {
		width: 100%;
		height: 100%;
		background-color: black; /* Background for the display area before content loads */
		display: block; /* Ensure it's a block element */
	}
</style>

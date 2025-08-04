<script lang="ts">
	import { onMount } from 'svelte';
	import { tryPlausible, showElement, hideElement } from "./utilities";

	// --- Minecraft Launch Configuration ---
	const pathJarMinecraft = "/app/First InfDev.jar";
	const pathJarLaunchWrapper = "/app/launchwrapper-1.6.jar";
	const pathJarLibs = `/app/InterceptingJar.jar:${pathJarLaunchWrapper}:/app/asm-all-4.1.jar:/app/jopt-simple-4.5.jar:/app/lwjgl/LWJGL-PATCH2.jar:/app/lwjgl/lwjgl_util-2.9.3.jar:${pathJarMinecraft}`;

	// DOM element references
	let display: HTMLDivElement;
	let intro: HTMLDivElement;

	/**
	 * Initializes CheerpJ and sets up network hooks (only if still needed for *other* URLs).
	 */
	async function startCheerpJ() {
		await cheerpjInit({
			version: 8,
			javaProperties: ["java.library.path=/app/lwjgl/libraries/"],
			libraries: {"libGL.so.1": "/app/lwjgl/libraries/gl4es.wasm"},
			enableX11:true,
			preloadResources:{"/lt/8/jre/lib/rt.jar":[0,131072,1310720,1572864,4456448,4849664,5111808,5505024,7995392,8126464,9699328,9830400,9961472,11534336,11665408,12189696,12320768,12582912,13238272,13369344,15073280,15335424,15466496,15597568,15990784,16121856,16252928,16384000,16777216,16908288,17039360,17563648,17694720,17825792,17956864,18087936,18219008,18612224,18743296,18874368,19005440,19136512,19398656,19791872,20054016,20709376,20840448,21757952,21889024,26869760],"/lt/etc/users":[0,131072],"/lt/etc/localtime":[],"/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],"/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],"/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],"/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],"/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],"/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],"/lt/8/lib/ext/sunjce_provider.jar":[],"/lt/8/lib/security/java.security":[0,131072],"/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/jre/lib":[],"/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],"/lt/8/lib/currency.data":[0,131072],"/lt/8/lib/currency.properties":[],"/lt/libraries/libGLESv2.so.1":[0,262144],"/lt/libraries/libEGL.so.1":[0,262144],"/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/etc/hosts":[],"/lt/etc/resolv.conf":[0,131072],"/lt/8/lib/fonts/fallback":[],"/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/ttf":[],"/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],"/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],"/lt/8/lib/jaxp.properties":[],"/lt/etc/timezone":[],"/lt/8/lib/tzdb.dat":[0,131072]}
		});

		await cheerpjCreateDisplay(-1, -1, display);
	}

	async function startGame() {
		hideElement(intro);
		showElement(display);

		await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

		tryPlausible("Play"); // Log play event if plausible is configured

		await cheerpjRunMain(
			"com.STG.Main.InterceptingJar",
			pathJarLibs,
			"/app/"

		);

// Wait a bit to ensure Minecraft window is created
await new Promise(resolve => setTimeout(resolve, 1000));

// Try to init AWTMouseShim
try {
	const shim = Java.type("com.STG.Shims.AWTMouseShim");
	shim.initFromTopFrame();
	console.log("AWTMouseShim initialized from top frame.");
} catch (e) {
	console.error("AWTMouseShim init failed:", e);
}
	}

	onMount(async () => {
		display = document.getElementById('display') as HTMLDivElement;
		intro = document.getElementById('intro') as HTMLDivElement;

		// *** THIS IS THE CRITICAL PART: REGISTER THE SERVICE WORKER ***
		if ('serviceWorker' in navigator) {
			try {
				// Register the service worker file located at the root of your domain.
				// The scope '/' means it will intercept requests for the entire site.
				const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
				console.log('Service Worker registered with scope:', registration.scope);
			} catch (error) {
				console.error('Service Worker registration failed:', error);
			}
		} else {
			console.warn('Service Workers are not supported in this browser. CORS issues will persist.');
		}

		// Begin CheerpJ initialization and game start.
		// It's good practice to start CheerpJ after Service Worker registration
		// so the SW has a chance to activate and take control.
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

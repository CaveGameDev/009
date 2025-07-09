<script lang="ts">
	import { onMount } from 'svelte';
	import { tryPlausible, showElement, hideElement } from "./utilities";

	// --- Minecraft Launch Configuration ---

	// Main Minecraft client JAR
	const pathJarMinecraft = "/app/b1.7.3.jar"; 

	// LaunchWrapper main JAR
	const pathJarLaunchWrapper = "/app/BtaBridgeTweaker.jar";

	// Combine all necessary JARs into the classpath for LaunchWrapper
	// LWJGL, ASM, and JOpt Simple JARs are now included directly in the classpath string.
	// Removed Log4j API and Core JARs to diagnose UnsatisfiedLinkError.
const pathJarLibs = `${pathJarLaunchWrapper}:/app/lwjgl/lwjgl-2.9.3.jar:/app/lwjgl/lwjgl_util-2.9.3.jar:${pathJarMinecraft}:/app/bta.jar`;

	let display: HTMLDivElement;
	let intro: HTMLDivElement;

	async function startCheerpJ() {
		await cheerpjInit({
			version: 8, // Set CheerpJ version to 8, suitable for Minecraft
			javaProperties: ["java.library.path=/app/lwjgl/libraries/"], // Path to native DLLs
			libraries: {"libGL.so.1": "/app/lwjgl/libraries/gl4es.wasm"},
			enableX11:true,
			// Preload resources for Java 8 runtime. These paths are typical for CheerpJ's internal structure.
			preloadResources:{"/lt/8/jre/lib/rt.jar":[0,131072,1310720,1572864,4456448,4849664,5111808,5505024,7995392,8126464,9699328,9830400,9961472,11534336,11665408,12189696,12320768,12582912,13238272,13369344,15073280,15335424,15466496,15597568,15990784,16121856,16252928,16384000,16777216,16908288,17039360,17563648,17694720,17825792,17956864,18087936,18219008,18612224,18743296,18874368,19005440,19136512,19398656,19791872,20054016,20709376,20840448,21757952,21889024,26869760],"/lt/etc/users":[0,131072],"/lt/etc/localtime":[],"/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],"/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],"/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],"/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],"/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],"/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],"/lt/8/lib/ext/sunjce_provider.jar":[],"/lt/8/lib/security/java.security":[0,131072],"/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/jre/lib":[],"/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],"/lt/8/lib/currency.data":[0,131072],"/lt/8/lib/currency.properties":[],"/lt/libraries/libGLESv2.so.1":[0,262144],"/lt/libraries/libEGL.so.1":[0,262144],"/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/etc/hosts":[],"/lt/etc/resolv.conf":[0,131072],"/lt/8/lib/fonts/fallback":[],"/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/ttf":[],"/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],"/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],"/lt/8/lib/jaxp.properties":[],"/lt/etc/timezone":[],"/lt/8/lib/tzdb.dat":[0,131072]}
		});

		await cheerpjCreateDisplay(-1, -1, display);
	}

	async function startGame() {
		hideElement(intro);
		showElement(display);

		await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

		tryPlausible("Play");
		// Use net.minecraft.launchwrapper.Launch as the main class,

		await cheerpjRunMain(
			"com.minedev.btabridge.BtaBridgeTweaker",
			pathJarLibs,
			"--minecraftJar", "b1.7.3.jar",
    			"--btaJar", "bta.jar",
			"--gamedir app/",
			"--username", "WebPlayer"        
		);
	}

	onMount(async () => {
		display = document.getElementById('display');
		intro = document.getElementById('intro');

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

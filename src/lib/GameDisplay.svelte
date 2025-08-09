<script lang="ts">
	import { onMount } from 'svelte';
	import { showElement, hideElement } from "./utilities";

	// The classpath is now a constant, as requested.
	const pathJarLibs = "/app/libraries/oshi-project/oshi-core/1.1/oshi-core-1.1.jar:/app/libraries/net/java/dev/jna/jna/4.4.0/jna-4.4.0.jar:/app/libraries/net/java/dev/jna/platform/3.4.0/platform-3.4.0.jar:/app/libraries/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar:/app/libraries/com/mojang/javabridge/1.0.22/javabridge-1.0.22.jar:/app/libraries/net/sf/jopt-simple/jopt-simple/5.0.3/jopt-simple-5.0.3.jar:/app/libraries/io/netty/netty-all/4.1.25.Final/netty-all-4.1.25.Final.jar:/app/libraries/com/google/guava/guava/21.0/guava-21.0.jar:/app/libraries/org/apache/commons/commons-lang3/3.5/commons-lang3-3.5.jar:/app/libraries/commons-io/commons-io/2.5/commons-io-2.5.jar:/app/libraries/commons-codec/commons-codec/1.10/commons-codec-1.10.jar:/app/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/app/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/app/libraries/com/mojang/brigadier/1.0.17/brigadier-1.0.17.jar:/app/libraries/com/mojang/datafixerupper/2.0.24/datafixerupper-2.0.24.jar:/app/libraries/com/google/code/gson/gson/2.8.0/gson-2.8.0.jar:/app/libraries/com/mojang/authlib/1.5.25/authlib-1.5.25.jar:/app/libraries/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar:/app/libraries/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar:/app/libraries/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar:/app/libraries/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar:/app/libraries/it/unimi/dsi/fastutil/8.2.1/fastutil-8.2.1.jar:/app/libraries/org/apache/logging/log4j/log4j-api/2.8.1/log4j-api-2.8.1.jar:/app/libraries/org/apache/logging/log4j/log4j-core/2.8.1/log4j-core-2.8.1.jar:/app/lwjgl-2.9.3.jar:/app/lwjgl_util-2.9.3.jar:/app/libraries/org/lwjgl/lwjgl-jemalloc/3.2.2/lwjgl-jemalloc-3.2.2.jar:/app/libraries/org/lwjgl/lwjgl-openal/3.2.2/lwjgl-openal-3.2.2.jar:/app/libraries/org/lwjgl/lwjgl-opengl/3.2.2/lwjgl-opengl-3.2.2.jar:/app/libraries/org/lwjgl/lwjgl-glfw/3.2.2/lwjgl-glfw-3.2.2.jar:/app/libraries/org/lwjgl/lwjgl-stb/3.2.2/lwjgl-stb-3.2.2.jar:/app/libraries/com/mojang/text2speech/1.11.3/text2speech-1.11.3.jar:/app/1.14.4.jar";

	// Functions to manage username and UUID
	function getOrPrompt(key: string, promptText: string, defaultValue: string) {
		// Always return "Player" as the username
		return "Player";
	}

	function getOrGenerateUUID(key: string) {
		let uuid = localStorage.getItem(key);
		if (!uuid || uuid.trim() === "") {
			uuid = [...Array(32)].map(() => "abcdef0123456789"[Math.floor(Math.random() * 16)]).join("");
			localStorage.setItem(key, uuid);
		}
		return uuid;
	}

	let displayElement: HTMLDivElement;
	let introElement: HTMLDivElement;
	let loadingStatusElement: HTMLParagraphElement;
	let introTextElement: HTMLParagraphElement;
	let introPromptElement: HTMLParagraphElement;

	// START: User-provided startCheerpJ function
	async function startCheerpJ() {
		await cheerpjInit({
			version: 8, // Set CheerpJ version to 8, suitable for Minecraft
			javaProperties: ["java.library.path=/app/lwjgl/libraries/"], // Path to native DLLs
			libraries: {"libGL.so.1": "/app/lwjgl/libraries/gl4es.wasm"},
			enableX11:true,
			// Preload resources for Java 8 runtime. These paths are typical for CheerpJ's internal structure.
			preloadResources:{"/lt/8/jre/lib/rt.jar":[0,131072,1310720,1572864,4456448,4849664,5111808,5505024,7995392,8126464,9699328,9830400,9961472,11534336,11665408,12189696,12320768,12582912,13238272,13369344,15073280,15335424,15466496,15597568,15990784,16121856,16252928,16384000,16777216,16908288,17039360,17563648,17694720,17825792,17956864,18087936,18219008,18612224,18743296,18874368,19005440,19136512,19398656,19791872,20054016,20709376,20840448,21757952,21889024,26869760],"/lt/etc/users":[0,131072],"/lt/etc/localtime":[],"/lt/8/jre/lib/cheerpj-awt.jar":[0,131072],"/lt/8/lib/ext/meta-index":[0,131072],"/lt/8/lib/ext":[],"/lt/8/lib/ext/index.list":[],"/lt/8/lib/ext/localedata.jar":[],"/lt/8/jre/lib/jsse.jar":[0,131072,786432,917504],"/lt/8/jre/lib/jce.jar":[0,131072],"/lt/8/jre/lib/charsets.jar":[0,131072,1703936,1835008],"/lt/8/jre/lib/resources.jar":[0,131072,917504,1179648],"/lt/8/jre/lib/javaws.jar":[0,131072,1441792,1703936],"/lt/8/lib/ext/sunjce_provider.jar":[],"/lt/8/lib/security/java.security":[0,131072],"/lt/8/jre/lib/meta-index":[0,131072],"/lt/8/jre/lib":[],"/lt/8/lib/accessibility.properties":[],"/lt/8/lib/fonts/LucidaSansRegular.ttf":[],"/lt/8/lib/currency.data":[0,131072],"/lt/8/lib/currency.properties":[],"/lt/libraries/libGLESv2.so.1":[0,262144],"/lt/libraries/libEGL.so.1":[0,262144],"/lt/8/lib/fonts/badfonts.txt":[],"/lt/8/lib/fonts":[],"/lt/etc/hosts":[],"/lt/etc/resolv.conf":[0,131072],"/lt/8/lib/fonts/fallback":[],"/lt/fc/fonts/fonts.conf":[0,131072],"/lt/fc/ttf":[],"/lt/fc/cache/e21edda6a7db77f35ca341e0c3cb2a22-le32d8.cache-7":[0,131072],"/lt/fc/ttf/LiberationSans-Regular.ttf":[0,131072,262144,393216],"/lt/8/lib/jaxp.properties":[],"/lt/etc/timezone":[],"/lt/8/lib/tzdb.dat":[0,131072]}
		});
		await cheerpjCreateDisplay(856, 480, displayElement);
	}
	// END: User-provided startCheerpJ function

	// START: Updated startGame function
	async function startGame() {
		hideElement(introElement); // Assuming 'intro' should be 'introElement' based on previous context
		showElement(displayElement); // Assuming 'display' should be 'displayElement'
		displayElement.classList.add("zoomed");

		await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay

		// Use net.minecraft.client.main.Main as the main class,
		// and pass the username as a program argument.
		await cheerpjRunMain(
			"net.minecraft.client.main.Main",
			pathJarLibs,
			"--username", "WebPlayer"
		);
	}
	// END: Updated startGame function

	onMount(async () => {
		displayElement = document.getElementById('display') as HTMLDivElement;
		introElement = document.getElementById('intro') as HTMLDivElement;
		loadingStatusElement = document.getElementById('loading-status') as HTMLParagraphElement;
		introTextElement = document.getElementById('intro-text') as HTMLParagraphElement;
		introPromptElement = document.getElementById('intro-prompt') as HTMLParagraphElement;

		// Call the updated startCheerpJ function
		await startCheerpJ();

		// The game will start automatically once CheerpJ is loaded
		startGame();
	});
</script>

<div class="game-container">
	<div id="intro" class="intro">
		<p id="loading-status">Loading game files...</p>
		<p id="intro-text" class="hidden">This is Minecraft running unmodified in the browser.</p>
		<p id="intro-prompt" class="hidden">The game will start automatically once loaded.</p>
		<div class="disclaimer">
			This is not an official Minecraft product. It is not approved by or associated with Mojang or Microsoft.
		</div>
	</div>
	<div id="display" class="display"></div>
</div>

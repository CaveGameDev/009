<script lang="ts">
	import { onMount } from 'svelte';
	import { tryPlausible, showElement, hideElement } from "./utilities";

	// --- Minecraft Launch Configuration ---

	// Main Minecraft client JAR
	const pathJarMinecraft = "/app/b1.6.4.jar";

	// LaunchWrapper main JAR
	const pathJarLaunchWrapper = "/app/launchwrapper-1.6.jar";

	// Combine all necessary JARs into the classpath for LaunchWrapper
	// LWJGL, ASM, and JOpt Simple JARs are now included directly in the classpath string.
	// Removed Log4j API and Core JARs to diagnose UnsatisfiedLinkError.
	const pathJarLibs = `/app/lwjgl/lwjgl-2.9.3.jar:/app/lwjgl/lwjgl_util-2.9.3.jar:/app/libraries/com/mojang/netty/1.8.8/netty-1.8.8.jar:/app/libraries/com/mojang/realms/1.3.5/realms-1.3.5.jar:/app/libraries/org/apache/commons/commons-compress/1.8.1/commons-compress-1.8.1.jar:/app/libraries/org/apache/httpcomponents/httpclient/4.3.3/httpclient-4.3.3.jar:/app/libraries/commons-logging/commons-logging/1.1.3/commons-logging-1.1.3.jar:/app/libraries/org/apache/httpcomponents/httpcore/4.3.2/httpcore-4.3.2.jar:/app/libraries/java3d/vecmath/1.3.1/vecmath-1.3.1.jar:/app/libraries/net/sf/trove4j/trove4j/3.0.3/trove4j-3.0.3.jar:/app/libraries/com/ibm/icu/icu4j-core-mojang/51.2/icu4j-core-mojang-51.2.jar:/app/jopt-simple-4.5.jar:/app/libraries/com/paulscode/codecjorbis/20101023/codecjorbis-20101023.jar:/app/libraries/com/paulscode/codecwav/20101023/codecwav-20101023.jar:/app/libraries/com/paulscode/libraryjavasound/20101123/libraryjavasound-20101123.jar:/app/libraries/com/paulscode/librarylwjglopenal/20100824/librarylwjglopenal-20100824.jar:/app/libraries/com/paulscode/soundsystem/20120107/soundsystem-20120107.jar:/app/libraries/io/netty/netty-all/4.0.10.Final/netty-all-4.0.10.Final.jar:/app/libraries/com/google/guava/guava/15.0/guava-15.0.jar:/app/libraries/org/apache/commons/commons-lang3/3.1/commons-lang3-3.1.jar:/app/libraries/commons-io/commons-io/2.4/commons-io-2.4.jar:/app/libraries/commons-codec/commons-codec/1.9/commons-codec-1.9.jar:/app/libraries/net/java/jinput/jinput/2.0.5/jinput-2.0.5.jar:/app/libraries/net/java/jutils/jutils/1.0.0/jutils-1.0.0.jar:/app/libraries/com/google/code/gson/gson/2.2.4/gson-2.2.4.jar:/app/libraries/com/mojang/authlib/1.5.21/authlib-1.5.21.jar:/app/libraries/org/apache/logging/log4j/log4j-api/2.0-beta9/log4j-api-2.0-beta9.jar:/app/libraries/org/apache/logging/log4j/log4j-core/2.0-beta9/log4j-core-2.0-beta9.jar:/app/libraries/org/lwjgl/lwjgl/lwjgl/2.9.1/lwjgl-2.9.1.jar:/app/libraries/org/lwjgl/lwjgl/lwjgl_util/2.9.1/lwjgl_util-2.9.1.jar:/app/libraries/org/lwjgl/lwjgl/lwjgl-platform/2.9.1/lwjgl-platform-2.9.1-natives-linux.jar:/app/libraries/net/java/jinput/jinput-platform/2.0.5/jinput-platform-2.0.5-natives-linux.jar:/app/libraries/tv/twitch/twitch/5.16/twitch-5.16.jar:/app/libraries/tv/twitch/twitch-platform/5.16/twitch-platform-5.16-natives-linux-64.jar:/app/libraries/tv/twitch/twitch-external-platform/4.5/twitch-external-platform-4.5-natives-linux-64.jar:/app/libraries/tv/twitch/twitch-external-platform/4.5/twitch-external-platform-4.5-natives-linux-64.jar:/app/versions/1.7.10/1.7.10.jar`;

	// Variables from the TypeScript Variable Declarations Canvas
	const NICK = "default";
	const UUID = "00000000000000000000000000000000";

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
		//
		//
		await cheerpjRunMain(
			"net.minecraft.client.main.Main",
			pathJarLibs,
			"--version 1.7.10",
			"--gameDir .",
			"--assetsDir assets", // Added comma here
			"--assetIndex 1.7",
			"--accessToken 1337535510N",
			"--userType legacy" ,
			"--userProperties={}" ,
			"--versionType release",
			`--uuid ${UUID}`, // Used UUID variable
			`--username ${NICK}` // Used NICK variable
		);
	}

	onMount(async () => {
		display = document.getElementById('display') as HTMLDivElement;
		intro = document.getElementById('intro') as HTMLDivElement;

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

<script lang="ts">
	import { onMount } from 'svelte';
	import { tryPlausible, showElement, hideElement } from "./utilities";

	// --- Minecraft Launch Configuration ---

	// Main Minecraft client JAR
	const pathJarMinecraft = "/app/b1.7.3.jar"; 

	// LaunchWrapper main JAR
	const pathJarLaunchWrapper = "/app/launchwrapper-1.6.jar";

	// Combine all necessary JARs into the classpath for LaunchWrapper
	// LWJGL, ASM, and JOpt Simple JARs are now included directly in the classpath string.
	// Removed Log4j API and Core JARs to diagnose UnsatisfiedLinkError.
const pathJarLibs = `${pathJarLaunchWrapper}:/app/asm-all-4.1.jar:/app/jopt-simple-4.5.jar:/app/lwjgl/lwjgl.jar:/app/lwjgl-assimp/lwjgl-assimp.jar:/app/lwjgl-bgfx/lwjgl-bgfx.jar:/app/lwjgl-cuda/lwjgl-cuda.jar:/app/lwjgl-egl/lwjgl-egl.jar:/app/lwjgl-fmod/lwjgl-fmod.jar:/app/lwjgl-freetype/lwjgl-freetype.jar:/app/lwjgl-glfw/lwjgl-glfw.jar:/app/lwjgl-harfbuzz/lwjgl-harfbuzz.jar:/app/lwjgl-hwloc/lwjgl-hwloc.jar:/app/lwjgl-jawt/lwjgl-jawt.jar:/app/lwjgl-jemalloc/lwjgl-jemalloc.jar:/app/lwjgl-ktx/lwjgl-ktx.jar:/app/lwjgl-libdivide/lwjgl-libdivide.jar:/app/lwjgl-llvm/lwjgl-llvm.jar:/app/lwjgl-lmdb/lwjgl-lmdb.jar:/app/lwjgl-lz4/lwjgl-lz4.jar:/app/lwjgl-meow/lwjgl-meow.jar:/app/lwjgl-meshoptimizer/lwjgl-meshoptimizer.jar:/app/lwjgl-nanovg/lwjgl-nanovg.jar:/app/lwjgl-nfd/lwjgl-nfd.jar:/app/lwjgl-nuklear/lwjgl-nuklear.jar:/app/lwjgl-odbc/lwjgl-odbc.jar:/app/lwjgl-openal/lwjgl-openal.jar:/app/lwjgl-opencl/lwjgl-opencl.jar:/app/lwjgl-opengl/lwjgl-opengl.jar:/app/lwjgl-opengles/lwjgl-opengles.jar:/app/lwjgl-openvr/lwjgl-openvr.jar:/app/lwjgl-openxr/lwjgl-openxr.jar:/app/lwjgl-opus/lwjgl-opus.jar:/app/lwjgl-ovr/lwjgl-ovr.jar:/app/lwjgl-par/lwjgl-par.jar:/app/lwjgl-remotery/lwjgl-remotery.jar:/app/lwjgl-rpmalloc/lwjgl-rpmalloc.jar:/app/lwjgl-shaderc/lwjgl-shaderc.jar:/app/lwjgl-spvc/lwjgl-spvc.jar:/app/lwjgl-sse/lwjgl-sse.jar:/app/lwjgl-stb/lwjgl-stb.jar:/app/lwjgl-tinyexr/lwjgl-tinyexr.jar:/app/lwjgl-tinyfd/lwjgl-tinyfd.jar:/app/lwjgl-tootle/lwjgl-tootle.jar:/app/lwjgl-vma/lwjgl-vma.jar:/app/lwjgl-vulkan/lwjgl-vulkan.jar:/app/lwjgl-xxhash/lwjgl-xxhash.jar:/app/lwjgl-yoga/lwjgl-yoga.jar:/app/lwjgl-zstd/lwjgl-zstd.jar:${pathJarMinecraft}:/app/bta.jar`;

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
			"net.minecraft.launchwrapper.Launch",
			pathJarLibs,
			"--tweakClass", "net.minecraft.launchwrapper.VanillaTweaker",
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

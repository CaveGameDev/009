<script lang="ts">
    import { onMount } from 'svelte';
    import { tryPlausible, showElement, hideElement } from "./utilities";
    import { onVersionChange } from "./jarworker.js";

    let display: HTMLDivElement;
    let intro: HTMLDivElement;

    let pathJarMinecraft = ""; // Will be set dynamically
    const pathJarLaunchWrapper = "/app/launchwrapper-1.6.jar";

    // Static libs, except client.jar slot
    function getPathJarLibs() {
        return `${pathJarLaunchWrapper}:/app/asm-all-4.1.jar:/app/jopt-simple-4.5.jar:/app/lwjgl/lwjgl-2.9.3.jar:/app/lwjgl/lwjgl_util-2.9.3.jar:${pathJarMinecraft}`;
    }

    // Listen for version updates from jarworker.js
    onVersionChange(version => {
        pathJarMinecraft = `/versions/${version}/client.jar`;
        console.log(`Selected JAR: ${pathJarMinecraft}`);
    });

    async function startCheerpJ() {
        await cheerpjInit({
            version: 8,
            javaProperties: ["java.library.path=/app/lwjgl/libraries/"],
            libraries: {"libGL.so.1": "/app/lwjgl/libraries/gl4es.wasm"},
            enableX11:true,
            preloadResources: { /* ... unchanged ... */ }
        });

        await cheerpjCreateDisplay(-1, -1, display);
    }

    async function startGame() {
        hideElement(intro);
        showElement(display);

        await new Promise(r => setTimeout(r, 100));
        tryPlausible("Play");

        if (!pathJarMinecraft) {
            console.error("No client.jar version selected!");
            return;
        }

        await cheerpjRunMain(
            "net.minecraft.launchwrapper.Launch",
            getPathJarLibs(),
            "--tweakClass", "net.minecraft.launchwrapper.VanillaTweaker",
            "--username", "WebPlayer"
        );
    }

    onMount(() => {
        display = document.getElementById('display') as HTMLDivElement;
        intro = document.getElementById('intro') as HTMLDivElement;
        startCheerpJ();
    });
</script>

rewrite of the original browserc re aft site to run many different minecraft versions, no time limit. also added modified launchwrapper with url spoofing cor infdev/indev version, and currently working on lwjgl native mouse bypasser to use java.awt instead of lwjgl's native os-level cursor. also attempting to create authlib bypasses to run 1.6+ versions, as of now to just run 1.14.4.

simple explanation of how this works

basically, we use cheerpj to convert (transpile) java code in realtime to js, then obtain lwjgl and jars required for minecraft.
check (BETA 1.7.3) branch to see how it looks, it uses svelte, simply because that worked better than just js.

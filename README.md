# Classic Mario
Atempt to create a clone of Super Mario Bros (NES version) using only JavaScript vanilla, without any framworks.

Always trying to develop the game like if was actually for a NES. Whenever possible avoiding unnecessary memory and making everything as efficient as possible 

## Engine
The game has built in top of a small engine (also made only with vanilla javascript), the engine can be reuse for any other (2D) game.

The engine is capable of:

* Read any handle* any spritesheet
* Create animations
* Handle collisions
* Handle physics
* And more

*spritesheet handle is not complete because you has to manually define all the images.

The engine is in the process of documentation to be reused, but already works well, any questions you can make an issue or send me an email.

## Game Architecture
The game architecture actually is very simple:

* The folder assets has all the imagens used in this project.
* The Js folder has all the source code
* The level folder contains the descriptions of levels in json's
* As same as level folder, the sprites folder contains the descriptions of your entities e.g: mario, koopas, gombas and etc.
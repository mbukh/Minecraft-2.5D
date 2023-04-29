# Javascript 2.5D Tile Map Editor (in Minecraft styling)

This is a vanilla JavaScript implementation of a tile map editor. The program allows you to create a map using multiple layers of tiles. You can adjust the zoom level, move the map around and change the active tool to draw or erase tiles.



## Usage
1. Choose the active tool by clicking on the corresponding button in the toolbar.
2. Click on a tile to draw or erase it on the active layer.
3. Use the mouse scroll or the zoom buttons to adjust the zoom level.
4. Click on the map and drag to move it around.

## Files
- `game.html`: The main HTML file that contains the map and tools.
- `blocks.js`: Contains the block definitions and helper functions for working with blocks.
- `mapsGen.js`: Contains the functions for generating the map using Perlin Noise.
- `eventListeners.js`: Contains the event listeners for user interactions.
- `script.js`: Contains the main script for initializing and updating the map.
- `tools.js`: Contains the tool definitions and helper functions for working with tools.
- `utils.js`: Contains utility functions for creating and manipulating arrays.
- `perlin.js`: Contains the Perlin Noise library used for generating the map.

## Customization
You can customize the generated map by modifying the parameters in the mapsGen.js file:
- `seed`: Controls the randomization of the map. Change this value for a different map.
- `groundLevel`: Determines the overall height of the island above the sea.
- `mapLayers`: The number of layers in the 3D map.
- `mapSize`: The size of the map in columns and rows.
You can also add new blocks and tools by modifying the `blocks.js` and `tools.js` files.

## Ideas

-   ### no js version

https://benjaminaster.com/2d-css-minecraft/

-   ### jquery version by rdfriedl

https://codepen.io/rdfriedl/pen/bdvrjM

-   ### moving item / character

https://codepen.io/DrKain/pen/RaOmGx

-   ### about mapgen

https://www.redblobgames.com/maps/terrain-from-noise/#elevation-redistribution
https://www.redblobgames.com/maps/mapgen4/

-   [x] Make more vivid height and sands with shores at the same level
-   [x] Use function sumNeighbors() to detect almost islands

-   ### biomes and map creation

https://azgaar.wordpress.com/2017/06/30/biomes-generation-and-rendering/

## Credits

https://github.com/josephg/noisejs
Robert Friedl - initial implementation in JQuery.
MBUKH.DEV - vanilla JavaScript implementation.

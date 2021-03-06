import SpriteSheet from '../SpriteSheet.js';

import {createAnimation} from '../animation.js';
import {loadJSON, loadImage} from '../loader.js';

export function loadSpriteSheet(name) {
  return loadJSON(`sprites/${name}.json`)
    .then((sheetSpec) =>
      Promise.all([sheetSpec, loadImage(sheetSpec.imagePath)]),
    )
    .then(([sheetSpec, image]) => {
      const sprites = new SpriteSheet(image, sheetSpec.tileW, sheetSpec.tileH);

      if (sheetSpec.tiles) {
        sheetSpec.tiles.forEach((tileSpec) => {
          sprites.createTile(
            tileSpec.name,
            tileSpec.index[0],
            tileSpec.index[1],
          );
        });
      }

      if (sheetSpec.frames) {
        sheetSpec.frames.forEach((frameSpec) => {
          sprites.create(frameSpec.name, ...frameSpec.rect);
        });
      }

      if (sheetSpec.animations) {
        sheetSpec.animations.forEach((animSpec) => {
          const animation = createAnimation(
            animSpec.frames,
            animSpec.frameLength,
          );
          sprites.createAnimation(animSpec.name, animation);
        });
      }

      return sprites;
    });
}

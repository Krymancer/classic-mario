import InputRouter from './InputRouter.js';
import KeyboardState from './KeyboardState.js';
import Jump from './traits/Jump.js';
import Go from './traits/Go.js';

export function setupKeyboard(window) {
  const input = new KeyboardState();
  const router = new InputRouter();

  input.listen(window);

  input.addMapping('Space', (keyState) => {
    if (keyState) {
      router.route((entity) => entity.traits.get(Jump).start());
    } else {
      router.route((entity) => entity.traits.get(Jump).cancel());
    }
  });

  input.addMapping('ArrowUp', (keyState) => {
    if (keyState) {
      router.route((entity) => entity.traits.get(Jump).start());
    } else {
      router.route((entity) => entity.traits.get(Jump).cancel());
    }
  });
  input.addMapping('KeyZ', (keyState) => {
    if (keyState) {
      router.route((entity) => entity.traits.get(Jump).start());
    } else {
      router.route((entity) => entity.traits.get(Jump).cancel());
    }
  });

  input.addMapping('KeyX', (keyState) => {
    router.route((entity) => entity.turbo(keyState));
  });
  input.addMapping('ArrowRight', (keyState) => {
    router.route(
      (entity) => (entity.traits.get(Go).direction += keyState ? 1 : -1),
    );
  });
  input.addMapping('ArrowLeft', (keyState) => {
    router.route(
      (entity) => (entity.traits.get(Go).direction += keyState ? -1 : 1),
    );
  });

  return router;
}

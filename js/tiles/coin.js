function handle({entity, resolver, match}) {
  if (entity.player) {
    const grid = resolver.matrix;
    grid.delete(match.indexX, match.indexY);
    entity.player.addCoins(1);
  }
}

export const coin = [handle, handle];

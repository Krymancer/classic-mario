import {findPlayers} from '../player.js';

function getPlayerTrait(level) {
  for (const entity of findPlayers(level)) {
    return entity.player;
  }
}

function getTimerTrait(level) {
  for (const entity of level.entities) {
    if (entity.levelTimer) {
      return entity.levelTimer;
    }
  }
}

export function createDashboardLayer(font, level) {
  const LINE_1 = font.size;
  const LINE_2 = font.size * 2;

  const playerTrait = getPlayerTrait(level);
  const timerTrait = getTimerTrait(level);

  return function drawDashboard(context) {
    const name = playerTrait.name;
    const score = playerTrait.score;
    const coins = playerTrait.coins;
    const time = timerTrait.currentTime;

    font.print(name, context, 16, LINE_1);
    font.print(score.toString().padStart(6, '0'), context, 16, LINE_2);
    font.print('@x' + coins.toString().padStart(2, '0'), context, 90, LINE_2);
    font.print('WORLD', context, 152, LINE_1);
    font.print('1-1', context, 160, LINE_2);
    font.print('TIME', context, 208, LINE_1);
    font.print(
      time.toFixed().toString().padStart(3, '0'),
      context,
      216,
      LINE_2,
    );
  };
}

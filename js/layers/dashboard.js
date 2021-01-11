import {findPlayers} from '../player.js';
import LevelTimer from '../traits/LevelTimer.js';
import Player from '../traits/Player.js';

function getPlayerTrait(entities) {
  for (const entity of findPlayers(entities)) {
    return entity.traits.get(Player);
  }
}

function getTimerTrait(entities) {
  for (const entity of entities) {
    if (entity.traits.has(LevelTimer)) {
      return entity.traits.get(LevelTimer);
    }
  }
}

export function createDashboardLayer(font, level) {
  const LINE_1 = font.size;
  const LINE_2 = font.size * 2;

  const timerTrait = getTimerTrait(level.entities);

  return function drawDashboard(context) {
    const playerTrait = getPlayerTrait(level.entities);

    const playerName = playerTrait.name;
    const score = playerTrait.score;
    const coins = playerTrait.coins;
    const time = timerTrait.currentTime;
    const levelName = level.name;

    font.print(playerName, context, 16, LINE_1);
    font.print(score.toString().padStart(6, '0'), context, 16, LINE_2);
    font.print('@x' + coins.toString().padStart(2, '0'), context, 90, LINE_2);
    font.print('WORLD', context, 152, LINE_1);
    font.print(levelName, context, 160, LINE_2);
    font.print('TIME', context, 208, LINE_1);
    font.print(
      time.toFixed().toString().padStart(3, '0'),
      context,
      216,
      LINE_2,
    );
  };
}

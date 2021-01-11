export class Vector2d {
  constructor(x, y) {
    this.set(x, y);
  }

  copy(vec2) {
    this.x = vec2.x;
    this.y = vec2.y;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Matrix {
  constructor() {
    this.grid = [];
  }

  set(x, y, value) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }

  get(x, y) {
    const col = this.grid[x];
    if (col) {
      return col[y];
    }

    return undefined;
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  delete(x, y) {
    const col = this.grid[x];
    if (col) {
      delete col[y];
    }
  }
}

export const Direction = {
  UP: new Vector2d(0, -1),
  DOWN: new Vector2d(0, 1),
  RIGHT: new Vector2d(1, 0),
  LEFT: new Vector2d(-1, 0),
};

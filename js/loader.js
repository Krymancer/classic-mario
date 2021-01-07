export function loadImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener('load', () => {
      resolve(img);
    });
    img.src = path;
  });
}

export function loadJSON(path) {
  return fetch(path).then((res) => res.json());
}

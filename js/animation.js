export function createAnimation(frames, framesLength) {
  return function resolveFrame(distance) {
    const frameIndex = Math.floor((distance / framesLength) % frames.length);
    const frameName = frames[frameIndex];
    return frameName;
  };
}

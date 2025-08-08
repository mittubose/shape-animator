import { interpolate } from './Canvas';

describe('interpolate', () => {
  it('should return null if keyframes are empty', () => {
    expect(interpolate([], 0)).toBeNull();
  });

  it('should return the value of the only keyframe', () => {
    const keyframes = [{ time: 0, value: 100 }];
    expect(interpolate(keyframes, 0)).toBe(100);
  });

  it('should return the first keyframe value if currentTime is before the first keyframe', () => {
    const keyframes = [
      { time: 1, value: 100 },
      { time: 2, value: 200 },
    ];
    expect(interpolate(keyframes, 0)).toBe(100);
  });

  it('should return the last keyframe value if currentTime is after the last keyframe', () => {
    const keyframes = [
      { time: 1, value: 100 },
      { time: 2, value: 200 },
    ];
    expect(interpolate(keyframes, 3)).toBe(200);
  });

  it('should interpolate between two keyframes', () => {
    const keyframes = [
      { time: 1, value: 100 },
      { time: 2, value: 200 },
    ];
    expect(interpolate(keyframes, 1.5)).toBe(150);
  });
});
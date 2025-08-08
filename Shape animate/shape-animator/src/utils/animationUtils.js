export const interpolateProperty = (keyframes, currentTime) => {
  if (!keyframes || keyframes.length === 0) {
    return undefined;
  }

  // Sort keyframes by time
  const sortedKeyframes = [...keyframes].sort((a, b) => a.time - b.time);

  // Find the relevant keyframes for interpolation
  let startKeyframe = null;
  let endKeyframe = null;

  for (let i = 0; i < sortedKeyframes.length; i++) {
    if (sortedKeyframes[i].time <= currentTime) {
      startKeyframe = sortedKeyframes[i];
    }
    if (sortedKeyframes[i].time >= currentTime) {
      endKeyframe = sortedKeyframes[i];
      break;
    }
  }

  if (!startKeyframe && endKeyframe) {
    // Current time is before the first keyframe, use the first keyframe's value
    return endKeyframe.value;
  }

  if (startKeyframe && !endKeyframe) {
    // Current time is after the last keyframe, use the last keyframe's value
    return startKeyframe.value;
  }

  if (startKeyframe === endKeyframe) {
    // Current time is exactly on a keyframe
    return startKeyframe.value;
  }

  // Interpolate between startKeyframe and endKeyframe
  const timeDiff = endKeyframe.time - startKeyframe.time;
  const progress = (currentTime - startKeyframe.time) / timeDiff;

  // Simple linear interpolation for now
  if (typeof startKeyframe.value === 'number' && typeof endKeyframe.value === 'number') {
    return startKeyframe.value + (endKeyframe.value - startKeyframe.value) * progress;
  } else if (typeof startKeyframe.value === 'string' && startKeyframe.value.startsWith('#') && endKeyframe.value.startsWith('#')) {
    // Basic color interpolation (hex only)
    const hexToRgb = hex => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    };

    const rgbToHex = (r, g, b) => {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const startRgb = hexToRgb(startKeyframe.value);
    const endRgb = hexToRgb(endKeyframe.value);

    const interpolatedRgb = startRgb.map((startVal, i) =>
      Math.round(startVal + (endRgb[i] - startVal) * progress)
    );

    return rgbToHex(...interpolatedRgb);
  }

  // For other types, just return the start keyframe value
  return startKeyframe.value;
};

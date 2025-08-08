import lottie from 'lottie-web';

export const exportToLottie = (shapes, keyframes, canvasSize) => {
  const animationData = {
    v: '5.5.2',
    fr: 60,
    ip: 0,
    op: 60,
    w: canvasSize.width,
    h: canvasSize.height,
    nm: 'Shape Animator Export',
    ddd: 0,
    assets: [],
    layers: [],
  };

  shapes.forEach(shape => {
    const layer = {
      ddd: 0,
      ind: shape.id,
      ty: 4, // Shape layer
      nm: shape.id,
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 }, // Opacity
        r: { a: 0, k: 0, ix: 10 }, // Rotation
        p: { a: 1, k: [], ix: 2 }, // Position
        a: { a: 0, k: [0, 0, 0], ix: 1 }, // Anchor Point
        s: { a: 0, k: [100, 100, 100], ix: 6 }, // Scale
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ty: 'rc',
              d: 1,
              s: { a: 0, k: [shape.width, shape.height], ix: 3 },
              p: { a: 0, k: [shape.width / 2, shape.height / 2], ix: 2 },
              r: { a: 0, k: 0, ix: 4 },
              nm: 'Rectangle',
            },
            {
              ty: 'fl',
              c: { a: 0, k: [1, 0, 0, 1], ix: 4 }, // Color
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              nm: 'Fill',
            },
          ],
          nm: 'Shape Group',
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    };

    if (keyframes[shape.id] && keyframes[shape.id].x) {
      keyframes[shape.id].x.forEach(k => {
        layer.ks.p.k.push({ t: k.time * 60, s: [k.value, shape.y, 0], h: 1 });
      });
    }

    if (keyframes[shape.id] && keyframes[shape.id].y) {
      keyframes[shape.id].y.forEach(k => {
        const existingKeyframe = layer.ks.p.k.find(key => key.t === k.time * 60);
        if (existingKeyframe) {
          existingKeyframe.s[1] = k.value;
        } else {
          layer.ks.p.k.push({ t: k.time * 60, s: [shape.x, k.value, 0], h: 1 });
        }
      });
    }

    animationData.layers.push(layer);
  });

  return animationData;
};
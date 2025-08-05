export const exportToLottie = (shapes, keyframes) => {
  const lottie = {
    v: '5.5.9',
    fr: 60,
    ip: 0,
    op: 60,
    w: window.innerWidth - 450,
    h: window.innerHeight - 200,
    nm: 'Shape Animation',
    ddd: 0,
    assets: [],
    layers: [],
  };

  shapes.forEach((shape) => {
    const layer = {
      ty: 4, // Shape layer
      nm: `Shape ${shape.id}`,
      sr: 1,
      ks: {
        o: { a: 0, k: 100 }, // Opacity
        r: { a: 0, k: 0 }, // Rotation
        p: { a: 0, k: [shape.x, shape.y, 0] }, // Position
        a: { a: 0, k: [0, 0, 0] }, // Anchor point
        s: { a: 0, k: [100, 100, 100] }, // Scale
      },
      ao: 0,
      shapes: [
        {
          ty: 'rc',
          nm: 'Rectangle',
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [shape.width, shape.height] },
          r: { a: 0, k: 0 },
          f: {
            ty: 'fl',
            c: { a: 0, k: [1, 0, 0, 1] }, // Color
          },
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    };
    lottie.layers.push(layer);
  });

  return lottie;
};

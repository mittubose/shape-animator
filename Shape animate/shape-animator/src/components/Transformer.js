import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';

const TransformerComponent = ({ selectedShape }) => {
  const transformerRef = useRef();

  useEffect(() => {
    if (selectedShape && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne(`#${selectedShape}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedShape]);

  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        // limit resize
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

export default TransformerComponent;

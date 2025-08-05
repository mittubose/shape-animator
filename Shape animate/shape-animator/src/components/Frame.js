import React from 'react';
import { Rect } from 'react-konva';

const Frame = ({ frameProps, isSelected, onSelect, onChange }) => {
  return (
    <Rect
      x={frameProps.x}
      y={frameProps.y}
      width={frameProps.width}
      height={frameProps.height}
      stroke="#ccc"
      strokeWidth={1}
      dash={[10, 5]} // Dashed border for frames
      onClick={onSelect}
      onTap={onSelect}
      draggable
      onDragEnd={(e) => {
        onChange({
          ...frameProps,
          x: e.target.x(),
          y: e.target.y(),
        });
      }}
    />
  );
};

export default Frame;

import React, { useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Rect, Group, Circle, Path, Text } from 'react-konva';
import { useDrop } from 'react-dnd';
import TransformerComponent from './Transformer';
import styled from 'styled-components';
import ContextMenu from './ContextMenu';
import Frame from './Frame';

import Konva from 'konva';

const Canvas = ({ showRulers, zoom, frame, onFrameTransform, shapes, components, layerRef, setActiveFrame, links, canvasSize, transitions, onDrop, activeState, setSelectedShape, setShapePosition, currentTime, keyframes, activeTool, updateShapes, selectedShape }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'libraryItem',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = layerRef.current.getStage().container().getBoundingClientRect();
      onDrop(item, {
        x: (offset.x - canvasRect.left) / zoom,
        y: (offset.y - canvasRect.top) / zoom,
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const stageRef = useRef();

  const handleStageClick = (e) => {
    if (e.target === e.target.getStage()) {
      setSelectedShape(null);
    }
  };

  const handleShapeDragEnd = (e) => {
    const shapeId = e.target.id();
    const newX = e.target.x();
    const newY = e.target.y();
    setShapePosition(shapeId, newX, newY);
  };

  const handleTransformEnd = (e) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    const x = node.x();
    const y = node.y();

    node.scaleX(1);
    node.scaleY(1);

    updateShapes(shapes.map(s => {
      if (s.id === node.id()) {
        return {
          ...s,
          x: x,
          y: y,
          width: Math.max(5, node.width() * scaleX),
          height: Math.max(5, node.height() * scaleY),
          rotation: rotation,
        };
      }
      return s;
    }));
  };

  const getShapeProps = (shape) => {
    const animatedProps = {};
    if (keyframes[shape.id]) {
      Object.keys(keyframes[shape.id]).forEach(prop => {
        const kfs = keyframes[shape.id][prop];
        // Find the keyframe relevant to the current time
        const activeKf = kfs.find(kf => kf.time <= currentTime) || kfs[0];
        if (activeKf) {
          animatedProps[prop] = activeKf.value;
        }
      });
    }
    return { ...shape, ...animatedProps };
  };

  return (
    <div ref={drop} style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Stage
        width={canvasSize.width * zoom}
        height={canvasSize.height * zoom}
        scaleX={zoom}
        scaleY={zoom}
        ref={stageRef}
        onClick={handleStageClick}
      >
        <Layer ref={layerRef}>
          <Frame
            width={frame.width}
            height={frame.height}
            fill={frame.fill}
            onTransform={onFrameTransform}
            isSelected={selectedShape === 'frame'}
          />
          {shapes.map((shape) => {
            const shapeProps = getShapeProps(shape);
            if (shape.type === 'rectangle') {
              return (
                <Rect
                  key={shape.id}
                  id={shape.id}
                  x={shapeProps.x}
                  y={shapeProps.y}
                  width={shapeProps.width}
                  height={shapeProps.height}
                  fill={shapeProps.fill}
                  draggable
                  onDragEnd={handleShapeDragEnd}
                  onClick={() => setSelectedShape(shape.id)}
                  onTransformEnd={handleTransformEnd}
                />
              );
            } else if (shape.type === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  id={shape.id}
                  x={shapeProps.x}
                  y={shapeProps.y}
                  radius={shapeProps.radius}
                  fill={shapeProps.fill}
                  draggable
                  onDragEnd={handleShapeDragEnd}
                  onClick={() => setSelectedShape(shape.id)}
                  onTransformEnd={handleTransformEnd}
                />
              );
            } else if (shape.type === 'text') {
              return (
                <Text
                  key={shape.id}
                  id={shape.id}
                  x={shapeProps.x}
                  y={shapeProps.y}
                  text={shapeProps.text}
                  fontSize={shapeProps.fontSize}
                  fill={shapeProps.fill}
                  draggable
                  onDragEnd={handleShapeDragEnd}
                  onClick={() => setSelectedShape(shape.id)}
                  onTransformEnd={handleTransformEnd}
                />
              );
            }
            return null;
          })}
          {selectedShape && selectedShape !== 'frame' && (
            <TransformerComponent
              selectedNode={layerRef.current?.findOne(`#${selectedShape}`)}
              onTransformEnd={handleTransformEnd}
            />
          )}
        </Layer>
      </Stage>
      {/* Context Menu */}
      {/* <ContextMenu x={100} y={100} onCopy={() => {}} onPaste={() => {}} onDelete={() => {}} /> */}
    </div>
  );
};

export default Canvas;
import React, { useEffect, useRef, useMemo } from 'react';
import { Stage, Layer, Rect, Group } from 'react-konva';
import { useDrop } from 'react-dnd';

const renderShape = React.memo((shape, setActiveFrame, links, canvasSize, transitions, activeState) => {
  const shapeRef = useRef(null);

  useEffect(() => {
    const node = shapeRef.current;
    if (node) {
      const handleMouseMove = (e) => {
        const transition = transitions.find(t => t.from === activeState && t.trigger === 'mouse-follow');
        if (transition) {
          // Implement mouse follow logic here
        }
      };
      node.getStage().on('mousemove', handleMouseMove);
      return () => node.getStage().off('mousemove', handleMouseMove);
    }
  }, [transitions]);

  const onClick = () => {
    if (links[shape.id]) {
      setActiveFrame(links[shape.id]);
    }
  };

  const getPosition = () => {
    let { x, y } = shape;
    if (shape.constraints) {
      if (shape.constraints.right) {
        x = canvasSize.width - shape.width - x;
      }
      if (shape.constraints.bottom) {
        y = canvasSize.height - shape.height - y;
      }
    }
    return { x, y };
  };

  return <Rect ref={shapeRef} key={shape.id} {...shape} {...getPosition()} id={shape.id} onClick={onClick} onTap={onClick} tabIndex={0} aria-label={`Shape ${shape.id}`} />;
});

const renderComponent = React.memo((component, shapes, setActiveFrame, links, canvasSize, transitions, activeState) => {
  return (
    <Group key={component.id} tabIndex={0} aria-label={`Component ${component.id}`}>
      {component.shapes.map(shapeId => renderShape(shapes.find(s => s.id === shapeId), setActiveFrame, links, canvasSize, transitions, activeState))}
      {component.children.map(child => renderComponent(child, shapes, setActiveFrame, links, canvasSize, transitions, activeState))}
    </Group>
  );
});

const Canvas = ({ shapes, components, layerRef, setActiveFrame, links, canvasSize, transitions, onDrop, activeState }) => {
  const [, drop] = useDrop(() => ({
    accept: 'libraryItem',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      onDrop(item, offset);
    },
  }));

  const topLevelComponents = useMemo(() => Object.values(components).filter(c => !Object.values(components).some(p => p.children.includes(c.id))), [components]);
  const unassignedShapes = useMemo(() => shapes.filter(shape => !Object.values(components).some(c => c.shapes.includes(shape.id))), [shapes, components]);

  return (
    <div ref={drop} tabIndex={0} aria-label="Canvas area">
      <Stage width={canvasSize.width} height={canvasSize.height}>
        <Layer ref={layerRef}>
          {topLevelComponents.map(component => renderComponent(component, shapes, setActiveFrame, links, canvasSize, transitions, activeState))}
          {unassignedShapes.map(shape => renderShape(shape, setActiveFrame, links, canvasSize, transitions, activeState))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Canvas;

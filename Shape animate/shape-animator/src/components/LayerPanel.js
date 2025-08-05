import React from 'react';
import styled from 'styled-components';

const LayerPanelContainer = styled.div`
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
`;

const LayerItem = styled.div`
  padding: 5px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#e3f2fd' : 'transparent')};
  margin-left: ${({ level }) => level * 10}px;
`;

const ComponentItem = styled.div`
  padding: 5px;
  font-weight: bold;
  margin-left: ${({ level }) => level * 10}px;
`;

const renderLayer = (item, level, setSelectedShape) => {
  if (item.shapes) {
    return (
      <ComponentItem key={item.id} level={level} tabIndex={0} aria-label={`Component ${item.id}`}>
        {item.id}
        {item.shapes.map(shapeId => (
          <LayerItem key={shapeId} level={level + 1} onClick={() => setSelectedShape(shapeId)} tabIndex={0} aria-label={`Shape ${shapeId}`}>
            Shape {shapeId}
          </LayerItem>
        ))}
        {item.children.map(child => renderLayer(child, level + 1, setSelectedShape))}
      </ComponentItem>
    );
  } else {
    return (
      <LayerItem key={item.id} level={level} onClick={() => setSelectedShape(item.id)} tabIndex={0} aria-label={`Shape ${item.id}`}>
        Shape {item.id}
      </LayerItem>
    );
  }
};

const LayerPanel = ({ shapes, components, setSelectedShape }) => {
  const topLevelItems = Object.values(components).filter(c => !Object.values(components).some(p => p.children.includes(c.id)));
  const unassignedShapes = shapes.filter(shape => !Object.values(components).some(c => c.shapes.includes(shape.id)));

  return (
    <LayerPanelContainer tabIndex={0} aria-label="Layers panel">
      {topLevelItems.map(item => renderLayer(item, 0, setSelectedShape))}
      {unassignedShapes.map(shape => renderLayer(shape, 0, setSelectedShape))}
    </LayerPanelContainer>
  );
};

export default LayerPanel;

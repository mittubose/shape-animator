import React, { useState } from 'react';
import styled from 'styled-components';
import { CaretRight, CaretDown, Eye, LockSimple, FolderSimple, Cube } from '@phosphor-icons/react';

const LayerPanelContainer = styled.div`
  width: 250px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.sm};
  display: flex;
  flex-direction: column;
`;

const LayerPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const LayerList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const LayerItemContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xs} 0;
  margin-left: ${({ level }) => level * 16}px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#3a76f7' : 'transparent')};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const LayerItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LayerPanelFooter = styled.div`
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LayerItem = ({ item, level, setSelectedShape, selectedShapes }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const isComponent = !!item.shapes;
  const children = isComponent ? item.shapes : item.children || [];

  return (
    <>
      <LayerItemContainer
        level={level}
        selected={selectedShapes.includes(item.id)}
        onClick={() => setSelectedShape(item.id)}
      >
        <LayerItemContent>
          {isComponent && (
            <button onClick={handleToggle}>{isExpanded ? <CaretDown size={16} /> : <CaretRight size={16} />}</button>
          )}
          <span>{isComponent ? <FolderSimple size={16} /> : <Cube size={16} />}</span>
          <span>{item.id}</span>
          <span><Eye size={16} /></span>
          <span><LockSimple size={16} /></span>
        </LayerItemContent>
      </LayerItemContainer>
      {isExpanded &&
        children.map((childId) => {
          // This is a simplified version. A real implementation would need to look up the child shape/component.
          return null;
        })}
    </>
  );
};

const LayerPanel = ({ shapes, components, setSelectedShape, selectedShapes, groupShapes, ungroupShapes }) => {
  const topLevelItems = Object.values(components).filter(
    (c) => !Object.values(components).some((p) => p.children.includes(c.id))
  );
  const unassignedShapes = shapes.filter(
    (shape) => !Object.values(components).some((c) => c.shapes.includes(shape.id))
  );

  return (
    <LayerPanelContainer>
      <LayerPanelHeader>
        <span>Layers</span>
        <button onClick={() => groupShapes(selectedShapes)} disabled={selectedShapes.length <= 1}>
          Group
        </button>
      </LayerPanelHeader>
      <LayerList>
        {[...topLevelItems, ...unassignedShapes].map((item) => (
          <LayerItem
            key={item.id}
            item={item}
            level={0}
            setSelectedShape={setSelectedShape}
            selectedShapes={selectedShapes}
          />
        ))}
      </LayerList>
      <LayerPanelFooter>
        <button>New Trigger</button>
      </LayerPanelFooter>
    </LayerPanelContainer>
  );
};

export default LayerPanel;

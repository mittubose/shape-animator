import React from 'react';
import styled from 'styled-components';
import { theme } from '../theme';

const LayerItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.hover : 'transparent'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const LayerPanel = ({ shapes, selectedId, onSelect }) => {
  return (
    <div>
      <h3 style={{ padding: `0 ${theme.spacing.md}` }}>Layers</h3>
      {shapes.map((shape) => (
        <LayerItem
          key={shape.id}
          isSelected={shape.id === selectedId}
          onClick={() => onSelect(shape.id)}
        >
          {shape.id} ({shape.type})
        </LayerItem>
      ))}
    </div>
  );
};

export default LayerPanel;

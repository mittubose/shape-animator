import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GearSix } from '@phosphor-icons/react';

const InspectorPanelContainer = styled.div`
  width: 320px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Placeholder = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InspectorPanel = ({ frame, updateFrame, selectedShape, shapes, ...props }) => {
  const selectedShapeData = selectedShape ? shapes.find(s => s.id === selectedShape) : null;

  const handleFrameColorChange = (e) => {
    updateFrame({ fill: e.target.value });
  };

  if (!selectedShapeData && selectedShape !== 'frame') {
    return (
      <InspectorPanelContainer>
        <Placeholder>
          <div style={{ fontSize: '2em', marginBottom: '16px' }}><GearSix size={32} /></div>
          <p>To modify properties,</p>
          <p>select an element.</p>
        </Placeholder>
      </InspectorPanelContainer>
    );
  }

  return (
    <InspectorPanelContainer>
      {selectedShape === 'frame' && (
        <div>
          <h3>Frame Properties</h3>
          <label>Background Color</label>
          <input type="color" value={frame.fill} onChange={handleFrameColorChange} />
        </div>
      )}
      {/* ... existing inspector panel content ... */}
    </InspectorPanelContainer>
  );
};

export default InspectorPanel;
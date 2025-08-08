import React from 'react';
import styled, { css } from 'styled-components';
import { Cursor, Rectangle, Circle, PencilSimple } from '@phosphor-icons/react';

const ToolboxContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToolButton = styled.button`
  background-color: ${({ $active, theme }) => $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => $active ? theme.colors.textOnPrimary : theme.colors.textPrimary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  ${({ $active, theme }) => $active && css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.textOnPrimary};
  `}
`;

const Toolbox = ({ onAddRectangle, onAddCircle, activeTool, setActiveTool }) => {
  return (
    <ToolboxContainer>
      <ToolButton onClick={() => setActiveTool('select')} $active={activeTool === 'select'} title="Select"><Cursor size={24} /></ToolButton>
      <ToolButton onClick={() => onAddRectangle()} title="Rectangle"><Rectangle size={24} /></ToolButton>
      <ToolButton onClick={() => onAddCircle()} title="Circle"><Circle size={24} /></ToolButton>
      <ToolButton onClick={() => setActiveTool('pen')} $active={activeTool === 'pen'} title="Pen"><PencilSimple size={24} /></ToolButton>
    </ToolboxContainer>
  );
};

export default Toolbox;

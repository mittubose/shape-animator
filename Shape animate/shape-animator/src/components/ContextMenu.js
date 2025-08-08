import React from 'react';
import styled from 'styled-components';
import { Copy, ClipboardText, Trash } from '@phosphor-icons/react';

const MenuContainer = styled.div`
  position: absolute;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const ContextMenu = ({ x, y, onCopy, onPaste, onDelete }) => {
  return (
    <MenuContainer x={x} y={y}>
      <MenuItem onClick={onCopy}><Copy size={16} /> Copy</MenuItem>
      <MenuItem onClick={onPaste}><ClipboardText size={16} /> Paste</MenuItem>
      <MenuItem onClick={onDelete}><Trash size={16} /> Delete</MenuItem>
    </MenuContainer>
  );
};

export default ContextMenu;

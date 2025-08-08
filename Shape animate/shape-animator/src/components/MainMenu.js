import React, { useState } from 'react';
import styled from 'styled-components';
import { File, PencilSimple, Eye } from '@phosphor-icons/react';

const MenuBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MenuItem = styled.div`
  position: relative;
  cursor: pointer;
`;

const SubMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.sm};
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const SubMenuItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }
`;

const MainMenu = ({ onExport, onImport }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <MenuBar>
      <MenuItem onClick={() => handleMenuClick('file')}>
        <File size={24} />
        <SubMenu isOpen={openMenu === 'file'}>
          <SubMenuItem onClick={onImport}>Import Project</SubMenuItem>
          <SubMenuItem onClick={onExport}>Export Project</SubMenuItem>
        </SubMenu>
      </MenuItem>
      <MenuItem onClick={() => handleMenuClick('edit')}>
        <PencilSimple size={24} />
        <SubMenu isOpen={openMenu === 'edit'}>
          <SubMenuItem>Undo</SubMenuItem>
          <SubMenuItem>Redo</SubMenuItem>
        </SubMenu>
      </MenuItem>
      <MenuItem onClick={() => handleMenuClick('view')}>
        <Eye size={24} />
        <SubMenu isOpen={openMenu === 'view'}>
          <SubMenuItem>Zoom In</SubMenuItem>
          <SubMenuItem>Zoom Out</SubMenuItem>
        </SubMenu>
      </MenuItem>
    </MenuBar>
  );
};

export default MainMenu;

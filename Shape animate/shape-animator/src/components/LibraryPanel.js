import React from 'react';
import styled from 'styled-components';
import { useDrag } from 'react-dnd';

const LibraryPanelContainer = styled.div`
  width: 250px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 10px;
`;

const LibraryItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'libraryItem',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '5px', border: '1px solid #ccc', marginBottom: '5px' }}>
      {item.name}
    </div>
  );
};

const LibraryPanel = ({ libraryItems }) => {
  

  return (
    <LibraryPanelContainer>
      <h3>Library</h3>
      {libraryItems.map(item => (
        <LibraryItem key={item.id} item={item} />
      ))}
    </LibraryPanelContainer>
  );
};

export default LibraryPanel;

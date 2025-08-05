import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Editor from './components/Editor';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Editor />
    </DndProvider>
  );
}

export default App;

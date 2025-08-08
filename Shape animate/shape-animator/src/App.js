import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Editor from './components/Editor';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { GlobalStyle } from './GlobalStyle';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Editor />
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;

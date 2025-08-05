import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Canvas from './Canvas';
import InspectorPanel from './InspectorPanel';
import LayerPanel from './LayerPanel';
import TimelinePanel from './TimelinePanel';
import ExportModal from './ExportModal';
import StateMachinePanel from './StateMachinePanel';
import BreakpointsPanel from './BreakpointsPanel';
import CommentSidebar from './CommentSidebar';
import LibraryPanel from './LibraryPanel';
import AiModal from './AiModal';
import { useHistory } from '../utils/useHistory';
import Konva from 'konva';

const EditorContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const TopToolbar = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
`;

const DevicePreview = styled.div`
  border: 1px solid #ccc;
  margin: 10px;
  overflow: auto;
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;

const Editor = () => {
  const [selectedShape, setSelectedShape] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeState, setActiveState] = useState('some_state');
  const layerRef = useRef(null);

  const [state, saveState, undo, redo, historyIndex, historyLength] = useHistory({
    shapes: [],
    keyframes: {},
    states: [],
    transitions: [],
    components: {},
    frames: [{ id: 'frame_0', name: 'Frame 1', children: [] }],
    activeFrame: 'frame_0',
    links: {},
    breakpoints: [
      { id: 'desktop', name: 'Desktop', width: 1920, height: 1080 },
      { id: 'tablet', name: 'Tablet', width: 768, height: 1024 },
      { id: 'mobile', name: 'Mobile', width: 375, height: 667 },
    ],
    activeBreakpoint: 'desktop',
    canvasSize: { width: 1920, height: 1080 },
    variables: {},
    libraryItems: [
      { id: 'preset_1', name: 'Button', type: 'component', shapes: [{ id: 'shape_0', x: 0, y: 0, width: 100, height: 40, fill: '#007bff' }] },
      { id: 'preset_2', name: 'Card', type: 'component', shapes: [{ id: 'shape_0', x: 0, y: 0, width: 200, height: 150, fill: '#ffffff', stroke: '#ccc' }] },
    ],
  });

  const { shapes, keyframes, states, transitions, components, frames, activeFrame, links, breakpoints, activeBreakpoint, canvasSize, variables, libraryItems } = state;

  const setActiveBreakpoint = useCallback((breakpointId) => {
    saveState({ ...state, activeBreakpoint: breakpointId });
  }, [state, saveState]);

  const setActiveFrame = useCallback((frameId) => {
    saveState({ ...state, activeFrame: frameId });
  }, [state, saveState]);

  

  useEffect(() => {
    const bp = breakpoints.find(b => b.id === activeBreakpoint);
    saveState({ ...state, canvasSize: { width: bp.width, height: bp.height } });
  }, [activeBreakpoint, breakpoints, saveState, state]);

  const addRectangle = () => {
    const newShape = { id: `shape_${shapes.length}`, x: 50, y: 50, width: 100, height: 100, fill: 'royalblue', frame: activeFrame, constraints: { left: true, top: true } };
    const newShapes = [...shapes, newShape];
    saveState({ ...state, shapes: newShapes });
  };

  const createComponent = () => {
    const newComponent = { id: `component_${Object.keys(components).length}`, shapes: [selectedShape], children: [] };
    const newComponents = { ...components, [newComponent.id]: newComponent };
    saveState({ ...state, components: newComponents });
  };

  const addKeyframe = (property) => {
    const newKeyframes = { ...keyframes };
    if (!newKeyframes[selectedShape]) {
      newKeyframes[selectedShape] = {};
    }
    if (!newKeyframes[selectedShape][property]) {
      newKeyframes[selectedShape][property] = [];
    }
    newKeyframes[selectedShape][property].push({ time: 0, value: shapes.find(s => s.id === selectedShape)[property] });
    saveState({ ...state, keyframes: newKeyframes });
  };

  const addTrigger = (fromState, toState, trigger, options) => {
    const newTransition = { from: fromState, to: toState, trigger, options };
    const newTransitions = [...transitions, newTransition];
    saveState({ ...state, transitions: newTransitions });
  };

  const linkFrames = (fromShape, toFrame) => {
    const newLinks = { ...links, [fromShape]: toFrame };
    saveState({ ...state, links: newLinks });
  };

  const playAnimation = () => {
    if (layerRef.current) {
      const shape = layerRef.current.findOne(`#${selectedShape}`);
      if (shape) {
        const transition = transitions.find(t => t.from === activeState && t.to === 'another_state'); // Example
        if (transition && evaluateCondition(transition.condition)) {
          const tween = new Konva.Tween({
            node: shape,
            duration: transition ? transition.options.duration : 1,
            delay: transition ? transition.options.delay : 0,
            easing: Konva.Easings[transition ? transition.options.easing : 'EaseInOut'],
            x: 200,
            y: 100,
          });
          tween.play();
        }
      }
    }
  };

  const setShapeConstraints = (shapeId, constraints) => {
    const newShapes = shapes.map(s => s.id === shapeId ? { ...s, constraints } : s);
    saveState({ ...state, shapes: newShapes });
  };

  const addVariable = (name, value) => {
    const newVariables = { ...variables, [name]: value };
    saveState({ ...state, variables: newVariables });
  };

  const evaluateCondition = (condition) => {
    if (!condition) return true;
    // Simple evaluation for now, e.g., "variable > 10"
    const [name, operator, value] = condition.split(' ');
    if (operator === '>') return variables[name] > value;
    if (operator === '<') return variables[name] < value;
    return false;
  };

  const handleDrop = (item, offset) => {
    const newShape = { ...item.shapes[0], id: `shape_${shapes.length}`, x: offset.x, y: offset.y, frame: activeFrame, constraints: { left: true, top: true } };
    const newShapes = [...shapes, newShape];
    saveState({ ...state, shapes: newShapes });
  };

  const handleAiGenerate = (prompt) => {
    setAiLoading(true);
    setTimeout(() => {
      console.log('AI Prompt:', prompt);
      // Simulate AI response - for now, just add a simple rectangle
      const newShape = { id: `shape_${shapes.length}`, x: 150, y: 150, width: 120, height: 120, fill: 'purple', frame: activeFrame, constraints: { left: true, top: true } };
      const newShapes = [...shapes, newShape];
      saveState({ ...state, shapes: newShapes });
      setAiLoading(false);
      setShowAiModal(false);
    }, 2000);
  };

  const handleExportProject = () => {
    const projectData = JSON.stringify(state, null, 2);
    const blob = new Blob([projectData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shape-animator-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportProject = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedState = JSON.parse(e.target.result);
          saveState(importedState);
        } catch (error) {
          console.error("Error parsing imported project file:", error);
          alert("Invalid project file. Please select a valid JSON file.");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleAddSelectedToLibrary = () => {
    if (selectedShape) {
      const shapeToAdd = shapes.find(s => s.id === selectedShape);
      if (shapeToAdd) {
        const newLibraryItem = { id: `custom_${libraryItems.length}`, name: `Custom Shape ${libraryItems.length + 1}`, type: 'shape', shapes: [shapeToAdd] };
        saveState({ ...state, libraryItems: [...libraryItems, newLibraryItem] });
      }
    }
  };

  return (
    <EditorContainer tabIndex={0} aria-label="Main editor area">
      <LibraryPanel libraryItems={libraryItems} />
      <LayerPanel shapes={shapes} components={components} setSelectedShape={setSelectedShape} />
      <MainContent>
        <TopToolbar>
          <div>
            <button onClick={addRectangle} aria-label="Add Rectangle">Add Rectangle</button>
            <button onClick={createComponent} aria-label="Create Component">Create Component</button>
            <button onClick={() => linkFrames(selectedShape, 'frame_1')} aria-label="Link Frames">Link Frames</button>
            <button onClick={playAnimation} aria-label="Play Animation">Play</button>
            <button onClick={() => setShowExportModal(true)} aria-label="Export">Export</button>
            <button onClick={handleExportProject} aria-label="Export Project">Export Project</button>
            <button onClick={() => document.getElementById('import-project-file').click()} aria-label="Import Project">Import Project</button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportProject}
              style={{ display: 'none' }}
              id="import-project-file"
            />
            <button onClick={() => setShowAiModal(true)} aria-label="Generate with AI">Generate with AI</button>
            <button onClick={handleAddSelectedToLibrary} aria-label="Add Selected to Library">Add Selected to Library</button>
          </div>
          <div>
            <button onClick={undo} disabled={historyIndex === 0} aria-label="Undo">Undo</button>
            <button onClick={redo} disabled={historyIndex === historyLength - 1} aria-label="Redo">Redo</button>
            <button aria-label="Login">Login</button>
          </div>
        </TopToolbar>
        <BreakpointsPanel breakpoints={breakpoints} activeBreakpoint={activeBreakpoint} setBreakpoint={setActiveBreakpoint} />
        <DevicePreview width={canvasSize.width} height={canvasSize.height}>
          <Canvas shapes={shapes.filter(s => s.frame === activeFrame)} components={components} layerRef={layerRef} setActiveFrame={setActiveFrame} links={links} canvasSize={canvasSize} transitions={transitions} onDrop={handleDrop} activeState={activeState} />
        </DevicePreview>
        <TimelinePanel keyframes={keyframes} />
        <StateMachinePanel setActiveState={setActiveState} />
      </MainContent>
      <InspectorPanel addKeyframe={addKeyframe} addTrigger={addTrigger} states={states} selectedShape={selectedShape} setShapeConstraints={setShapeConstraints} addVariable={addVariable} variables={variables} />
      <CommentSidebar />
      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        shapes={shapes}
        keyframes={keyframes}
      />
      <AiModal show={showAiModal} onClose={() => setShowAiModal(false)} onGenerate={handleAiGenerate} isLoading={aiLoading} />
    </EditorContainer>
  );
};

export default Editor;


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
import Toolbox from './Toolbox';
import { List, GearSix, Question, User, Share } from '@phosphor-icons/react';

const EditorContainer = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr 320px; /* Left sidebar, Main content, Right sidebar */
  grid-template-rows: auto 1fr auto; /* Top toolbar, Middle content, Bottom timeline */
  height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TopToolbar = styled.div`
  grid-column: 1 / -1; /* Span all columns */
  grid-row: 1;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const LeftSidebar = styled.div`
  grid-column: 1;
  grid-row: 2 / 4; /* Spans middle and bottom rows */
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const RightSidebar = styled.div`
  grid-column: 3;
  grid-row: 2 / 4; /* Spans middle and bottom rows */
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
`;

const MainContentArea = styled.div`
  grid-column: 2;
  grid-row: 2; /* Middle row */
  display: flex;
  flex-direction: column;
  background-color: #000;
  overflow: hidden; /* Prevent MainContentArea from scrolling */
`;

const TimelineAndStateMachineArea = styled.div`
  grid-column: 2;
  grid-row: 3;
  display: flex;
  height: 200px;
  background-color: lightgray;
  border-top: 1px solid black;
`;

const DevicePreview = styled.div`
  flex-grow: 1; /* Takes remaining space in MainContentArea */
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto; /* Only DevicePreview should scroll */
  position: relative;
`;

const ToolbarSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover};
  }

  &.primary {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.textOnPrimary};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Editor = () => {
  const [selectedShape, _setSelectedShape] = useState(null);
  const [selectedShapes, setSelectedShapes] = useState([]);

  const setSelectedShape = (shapeId, isMultiSelect = false) => {
    if (isMultiSelect) {
      if (selectedShapes.includes(shapeId)) {
        setSelectedShapes(selectedShapes.filter(id => id !== shapeId));
      } else {
        setSelectedShapes([...selectedShapes, shapeId]);
      }
    } else {
      setSelectedShapes([shapeId]);
    }
    _setSelectedShape(shapeId);
  };
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeState, setActiveState] = useState('some_state');
  const [activeTool, setActiveTool] = useState('select');
  const [currentTime, setCurrentTime] = useState(0);
  const layerRef = useRef(null);

  const [zoom, setZoom] = useState(1);
  const [showRulers, setShowRulers] = useState(true);

  const [state, saveState, undo, redo, historyIndex, historyLength] = useHistory({
    shapes: [],
    keyframes: {},
    states: [],
    transitions: [],
    components: {},
    frames: [{ id: 'frame_0', name: 'Frame 1', children: [] }],
    activeFrame: 'frame_0',
    frame: { width: 1920, height: 1080, fill: '#ffffff' },
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
    comments: [],
  });

  const { shapes, keyframes, states, transitions, components, frames, activeFrame, links, breakpoints, activeBreakpoint, canvasSize, variables, libraryItems, comments } = state;

  const updateShapes = (newShapes) => {
    saveState({ ...state, shapes: newShapes });
  }

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'c' && (e.metaKey || e.ctrlKey)) {
        const shapeToCopy = shapes.find(s => s.id === selectedShape);
        if (shapeToCopy) {
          localStorage.setItem('clipboard', JSON.stringify(shapeToCopy));
        }
      }

      if (e.key === 'v' && (e.metaKey || e.ctrlKey)) {
        const clipboardData = localStorage.getItem('clipboard');
        if (clipboardData) {
          const shapeToPaste = JSON.parse(clipboardData);
          const newShape = {
            ...shapeToPaste,
            id: `shape_${shapes.length}`,
            x: shapeToPaste.x + 10,
            y: shapeToPaste.y + 10,
          };
          updateShapes([...shapes, newShape]);
        }
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const newShapes = shapes.filter(s => s.id !== selectedShape);
        updateShapes(newShapes);
      }

      if (e.key === '=' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom(zoom => Math.min(zoom + 0.1, 5));
      }

      if (e.key === '-' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setZoom(zoom => Math.max(0.1, zoom - 0.1));
      }

      if (e.key === 'h' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowRulers(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedShape, shapes, updateShapes, zoom]);

  const addRectangle = () => {
    const newShape = { id: `shape_${shapes.length}`, x: 50, y: 50, width: 100, height: 100, fill: 'royalblue', frame: activeFrame, constraints: { left: true, top: true }, type: 'rectangle' };
    const newShapes = [...shapes, newShape];
    saveState({ ...state, shapes: newShapes });
  };

  const addCircle = () => {
    const newShape = { id: `shape_${shapes.length}`, x: 50, y: 50, radius: 50, fill: 'green', frame: activeFrame, constraints: { left: true, top: true }, type: 'circle' };
    const newShapes = [...shapes, newShape];
    saveState({ ...state, shapes: newShapes });
  };

  const updateFrame = (newProps) => {
    saveState({ ...state, frame: { ...state.frame, ...newProps } });
  }

  const createComponent = () => {
    const newComponent = { id: `component_${Object.keys(components).length}`, shapes: [selectedShape], children: [] };
    const newComponents = { ...components, [newComponent.id]: newComponent };
    saveState({ ...state, components: newComponents });
  };

  const addKeyframe = (property, time) => {
    const newKeyframes = { ...keyframes };
    if (!newKeyframes[selectedShape]) {
      newKeyframes[selectedShape] = {};
    }
    if (!newKeyframes[selectedShape][property]) {
      newKeyframes[selectedShape][property] = [];
    }
    newKeyframes[selectedShape][property].push({ time, value: shapes.find(s => s.id === selectedShape)[property], easing: 'linear' });
    saveState({ ...state, keyframes: newKeyframes });
  };

  const updateKeyframe = (shapeId, property, keyframeIndex, newKeyframe) => {
    const newKeyframes = { ...keyframes };
    newKeyframes[shapeId][property][keyframeIndex] = newKeyframe;
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

  const setShapePosition = (shapeId, newX, newY) => {
    const newShapes = shapes.map(s => s.id === shapeId ? { ...s, x: newX, y: newY } : s);
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

  const handleAiGenerate = (prompt, generationType) => {
    setAiLoading(true);
    setTimeout(() => {
      console.log('AI Prompt:', prompt);
      let newShapes = [];
      if (generationType === 'rectangle') {
        newShapes.push({ id: `shape_${shapes.length}`, x: 150, y: 150, width: 120, height: 120, fill: 'purple', frame: activeFrame, constraints: { left: true, top: true } });
      } else if (generationType === 'button') {
        newShapes.push({ id: `shape_${shapes.length}`, x: 150, y: 150, width: 100, height: 40, fill: '#007bff', frame: activeFrame, constraints: { left: true, top: true } });
        newShapes.push({ id: `shape_${shapes.length + 1}`, type: 'text', x: 160, y: 160, text: 'Button', fontSize: 20, fill: 'white', frame: activeFrame, constraints: { left: true, top: true } });
      } else if (generationType === 'card') {
        newShapes.push({ id: `shape_${shapes.length}`, x: 150, y: 150, width: 200, height: 150, fill: '#ffffff', stroke: '#ccc', frame: activeFrame, constraints: { left: true, top: true } });
        newShapes.push({ id: `shape_${shapes.length + 1}`, type: 'text', x: 160, y: 160, text: 'Card Title', fontSize: 24, fill: 'black', frame: activeFrame, constraints: { left: true, top: true } });
        newShapes.push({ id: `shape_${shapes.length + 2}`, type: 'text', x: 160, y: 200, text: 'Card content...', fontSize: 16, fill: 'black', frame: activeFrame, constraints: { left: true, top: true } });
      }

      saveState({ ...state, shapes: [...shapes, ...newShapes] });
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

  const groupShapes = (shapeIds) => {
    const newComponent = { id: `component_${Object.keys(components).length}`, shapes: shapeIds, children: [] };
    const newComponents = { ...components, [newComponent.id]: newComponent };
    saveState({ ...state, components: newComponents });
  };

  const ungroupShapes = (componentId) => {
    const component = components[componentId];
    const newComponents = { ...components };
    delete newComponents[componentId];
    saveState({ ...state, components: newComponents });
  };

  const reorderLayer = (draggedId, targetId) => {
    const newShapes = [...shapes];
    const draggedIndex = newShapes.findIndex(s => s.id === draggedId);
    const targetIndex = newShapes.findIndex(s => s.id === targetId);

    const [draggedItem] = newShapes.splice(draggedIndex, 1);
    newShapes.splice(targetIndex, 0, draggedItem);

    saveState({ ...state, shapes: newShapes });
  };

  const updateShape = (shapeId, newProps) => {
    const newShapes = shapes.map(s => s.id === shapeId ? { ...s, ...newProps } : s);
    saveState({ ...state, shapes: newShapes });
  };

  const setShapeConstraints = (shapeId, newConstraints) => {
    const newShapes = shapes.map(s => s.id === shapeId ? { ...s, constraints: newConstraints } : s);
    saveState({ ...state, shapes: newShapes });
  };

  const addInteraction = (shapeId, event, action) => {
    const newShapes = shapes.map(s => {
      if (s.id === shapeId) {
        const newInteractions = { ...s.interactions, [event]: action };
        return { ...s, interactions: newInteractions };
      }
      return s;
    });
    saveState({ ...state, shapes: newShapes });
  };

  const addState = (name) => {
    const newState = { id: `state_${states.length}`, name };
    const newStates = [...states, newState];
    saveState({ ...state, states: newStates });
  };

  const addTransition = (fromState, toState, trigger) => {
    const newTransition = { from: fromState, to: toState, trigger };
    const newTransitions = [...transitions, newTransition];
    saveState({ ...state, transitions: newTransitions });
  };

  const addComment = (text) => {
    const newComment = { id: `comment_${comments.length}`, text, author: 'User', timestamp: new Date() };
    const newComments = [...comments, newComment];
    saveState({ ...state, comments: newComments });
  };

  return (
    <EditorContainer tabIndex={0} aria-label="Main editor area">
      <TopToolbar>
        <ToolbarSection>
          <List size={24} />
          <div>
            <span>Drafts / New</span>
          </div>
        </ToolbarSection>
        <ToolbarSection>
          <Toolbox onAddRectangle={addRectangle} onAddCircle={addCircle} activeTool={activeTool} setActiveTool={setActiveTool} />
        </ToolbarSection>
        <ToolbarSection>
          <Button><Share size={24} /> Share</Button>
          <Button className="primary" onClick={() => setShowExportModal(true)}>Export</Button>
          <GearSix size={24} />
          <Question size={24} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'orange', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <User size={24} />
          </div>
          <span>260%</span>
        </ToolbarSection>
      </TopToolbar>

      <LeftSidebar>
        <LibraryPanel libraryItems={libraryItems} />
        <LayerPanel shapes={shapes} components={components} setSelectedShape={setSelectedShape} selectedShapes={selectedShapes} groupShapes={groupShapes} ungroupShapes={ungroupShapes} reorderLayer={reorderLayer} />
      </LeftSidebar>

      <MainContentArea>
        <BreakpointsPanel breakpoints={breakpoints} activeBreakpoint={activeBreakpoint} setBreakpoint={setActiveBreakpoint} />
        <DevicePreview>
          <Canvas showRulers={showRulers} zoom={zoom} frame={state.frame} onFrameTransform={updateFrame} shapes={shapes.filter(s => s.frame === activeFrame)} components={components} layerRef={layerRef} setActiveFrame={setActiveFrame} links={links} canvasSize={canvasSize} transitions={transitions} onDrop={handleDrop} activeState={activeState} setSelectedShape={setSelectedShape} setShapePosition={setShapePosition} currentTime={currentTime} keyframes={keyframes} activeTool={activeTool} updateShapes={updateShapes} selectedShape={selectedShape} />
        </DevicePreview>
      </MainContentArea>

      <RightSidebar>
        <InspectorPanel frame={state.frame} updateFrame={updateFrame} addKeyframe={addKeyframe} addTrigger={addTrigger} states={states} selectedShape={selectedShape} setShapeConstraints={setShapeConstraints} addVariable={addVariable} variables={variables} keyframes={keyframes} updateKeyframe={updateKeyframe} updateShape={updateShape} shapes={shapes} addInteraction={addInteraction} />
        <CommentSidebar addComment={addComment} comments={comments} />
      </RightSidebar>

      <TimelineAndStateMachineArea>
        <TimelinePanel keyframes={keyframes} addKeyframe={addKeyframe} selectedShape={selectedShape} currentTime={currentTime} setCurrentTime={setCurrentTime} />
        <StateMachinePanel setActiveState={setActiveState} addState={addState} addTransition={addTransition} states={states} transitions={transitions} />
      </TimelineAndStateMachineArea>

      <ExportModal
        show={showExportModal}
        onClose={() => setShowExportModal(false)}
        shapes={shapes}
        keyframes={keyframes}
        canvasSize={canvasSize}
      />
      <AiModal show={showAiModal} onClose={() => setShowAiModal(false)} onGenerate={handleAiGenerate} isLoading={aiLoading} />
    </EditorContainer>
  );
};

export default Editor;
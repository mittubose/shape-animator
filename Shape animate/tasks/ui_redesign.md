# UI Redesign Tasks

This document outlines the tasks required to redesign the UI of the `shape-animator` application to match the provided reference image (`Ref images/UI.png`).

## Phase 1: Layout and Basic Structure

### Task 1.1: Restructure `Editor.js` layout (Completed)
- Modified `EditorContainer` and `MainContent` to match the grid-like layout of the target UI (left sidebar, top bar, main content, bottom timeline, right sidebar).
- Introduced new styled components for the different sections (e.g., `LeftSidebar`, `TopBar`, `MainContentArea`, `TimelineAndStateMachineArea`, `RightSidebar`).

### Task 1.2: Implement Top Toolbar
- Redesign the top toolbar in `Editor.js` to include:
    - **Tool Section:** Icons for selection, pen, rectangle, text, image, hand, and comment tools. (This will involve modifying `Toolbox.js` and integrating it).
    - **Menu Area:**
        - "File" menu (or similar) with options for:
            - Save Project (as file)
            - Import Project (from file)
            - Export (Lottie, Image - PNG/JPG)
        - "Share" button.
        - Undo/Redo buttons.
        - Play/Pause controls.
        - Help/Info icon.
        - Code view toggle.
        - Zoom/Scale display.
- Integrate `BreakpointsPanel` visually into the top bar.

### Task 1.3: Update Left Layer Panel (`LayerPanel.js`)
- Adjust styling to match the dark theme and hierarchy display.
- Add "Drafts / New" section.
- Add "Load" dropdown.
- Add "New Trigger" button.
- Implement icons for elements (lightning bolt, eye).

## Phase 2: Canvas and Timeline Enhancements

### Task 2.1: Enhance Canvas Styling (`Canvas.js`)
- Apply dark background to the overall canvas area.
- Implement the white "Screen" area within the canvas.
- Add rulers along the top and left of the canvas.
- Implement the small controls below the canvas (play, loop, 1x, close).

### Task 2.2: Redesign Timeline Panel (`TimelinePanel.js`)
- Implement the detailed timeline view with individual layers.
- Display keyframe indicators (diamonds) for each layer.
- Implement the current time indicator and time ruler.
- Integrate play/pause, loop, and speed controls.

## Phase 3: Inspector Panel and Minor Details

### Task 3.1: Update Inspector Panel (`InspectorPanel.js`)
- Modify to display properties of selected elements as shown in the image (currently it's a placeholder).

### Task 3.2: Refine Styling and Theming
- Ensure consistent dark theme across all new and modified components.
- Review `GlobalStyle.js` and `theme.js` for necessary updates.

### Task 3.3: Enhanced Export Capabilities
- Modify `ExportModal.js` or create new components to support exporting the canvas as PNG/JPG images, in addition to Lottie.
- Add options for image quality, background transparency (for PNG), and dimensions.
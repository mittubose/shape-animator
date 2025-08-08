import { render } from '@testing-library/react';
import App from './App';

jest.mock('./components/Toolbox', () => ({
  __esModule: true,
  default: ({ onAddRectangle, onAddCircle, onAddPen, onSelectTool }) => (
    <div data-testid="mock-toolbox">
      Mock Toolbox
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddCircle}>Add Circle</button>
      <button onClick={onAddPen}>Add Pen</button>
      <button onClick={onSelectTool}>Select</button>
    </div>
  ),
}));

jest.mock('./components/TimelinePanel', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-timeline-panel">Mock Timeline Panel</div>,
}));

test('App renders without crashing', () => {
  render(<App />);
});
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Konva and React Konva
jest.mock('konva', () => {
  const Easings = {
    Linear: (t) => t,
    EaseIn: (t) => t * t,
    EaseOut: (t) => t * (2 - t),
    EaseInOut: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    BackEaseIn: (t) => t * t * (2.70158 * t - 1.70158),
    BackEaseOut: (t) => --t * t * (2.70158 * t + 1.70158) + 1,
    BackEaseInOut: (t) => {
      let s = 1.70158 * 1.525;
      if ((t *= 2) < 1) return (0.5 * (t * t * ((s + 1) * t - s)));
      return (0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2));
    },
    ElasticEaseIn: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
    },
    ElasticEaseOut: (t) => {
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    ElasticEaseInOut: (t) => {
      let s = 1.70158 * 1.525;
      if ((t *= 2) < 1) return (0.5 * (-Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI)));
      return (0.5 * (Math.pow(2, -10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI) + 2));
    },
    BounceEaseIn: (t) => 1 - Easings.BounceEaseOut(1 - t),
    BounceEaseOut: (t) => {
      if (t < (1 / 2.75)) {
        return (7.5625 * t * t);
      } else if (t < (2 / 2.75)) {
        return (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75);
      } else if (t < (2.5 / 2.75)) {
        return (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375);
      } else {
        return (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375);
      }
    },
    BounceEaseInOut: (t) => {
      if (t < 0.5) return Easings.BounceEaseIn(t * 2) * 0.5;
      return Easings.BounceEaseOut(t * 2 - 1) * 0.5 + 0.5;
    },
    StrongEaseIn: (t) => t * t * t * t * t,
    StrongEaseOut: (t) => 1 - Math.pow(1 - t, 5),
    StrongEaseInOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  };

  return {
    __esModule: true,
    default: {
      Tween: jest.fn().mockImplementation(() => ({
        play: jest.fn(),
      })),
      Easings: Easings,
    },
  };
});

jest.mock('react-konva', () => ({
  Stage: ({ children, ...props }) => <div {...props}>{children}</div>,
  Layer: ({ children, ...props }) => <div {...props}>{children}</div>,
  Rect: 'Rect',
  Group: 'Group',
  Circle: 'Circle',
  Path: 'Path',
  Text: 'Text',
}));

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  __esModule: true,
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children(jest.fn(), {}),
  Draggable: ({ children }) => children(jest.fn(), {}, jest.fn()),
}));

// Mock react-dnd
jest.mock('react-dnd', () => ({
  __esModule: true,
  useDrag: () => [{}, jest.fn()],
  useDrop: () => [{}, jest.fn()],
  DndProvider: ({ children }) => children,
}));

jest.mock('react-dnd-html5-backend', () => ({
  __esModule: true,
  HTML5Backend: 'HTML5Backend',
}));

// Mock lottie-web
jest.mock('lottie-web', () => ({
  __esModule: true,
  default: {
    loadAnimation: jest.fn(() => ({
      play: jest.fn(),
      stop: jest.fn(),
      pause: jest.fn(),
      setSpeed: jest.fn(),
      goToAndStop: jest.fn(),
      destroy: jest.fn(),
    })),
  },
}));

// Mock react-flow-renderer
jest.mock('react-flow-renderer', () => ({
  __esModule: true,
  default: ({ children, onElementsRemove, onConnect, onElementClick }) => {
    // Simulate children rendering
    const renderedChildren = typeof children === 'function' ? children([]) : children;
    return (
      <div data-testid="mock-react-flow-renderer">
        {renderedChildren}
        <button onClick={() => onElementsRemove([])}>Mock Remove Elements</button>
        <button onClick={() => onConnect({})}>Mock Connect</button>
        <button onClick={() => onElementClick({}, {})}>Mock Element Click</button>
      </div>
    );
  },
  MiniMap: () => <div data-testid="mock-minimap"></div>,
  Controls: () => <div data-testid="mock-controls"></div>,
  addEdge: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock react-draggable to avoid findDOMNode warning
jest.mock('react-draggable', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
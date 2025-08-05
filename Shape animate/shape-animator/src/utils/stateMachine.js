export const createState = (name) => {
  return {
    id: `state_${Date.now()}`,
    name,
    animations: [],
  };
};

export const createTransition = (fromState, toState, trigger) => {
  return {
    id: `transition_${Date.now()}`,
    from: fromState,
    to: toState,
    trigger,
  };
};

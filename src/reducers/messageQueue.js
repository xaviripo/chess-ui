const reducer = (state = [], action) => {
  switch (action.type) {
    case 'ENQUEUE':
      return [...state, action.payload];
    case 'DEQUEUE':
      return state.slice(1);
    default:
      return state;
  }
};

export default reducer;

const enqueue = payload => ({
  type: 'ENQUEUE',
  payload,
});

const dequeue = () => ({
  type: 'DEQUEUE',
})

export { enqueue, dequeue };
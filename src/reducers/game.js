const reducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_GAME':
      return action.game;
    default:
      return state;
  }
};

export default reducer;

const setGame = game => ({
  type: 'SET_GAME',
  game,
});

export { setGame };
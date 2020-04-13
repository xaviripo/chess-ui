const ActionType = {
  SET_GAME: 'SET_GAME',
  MOVE_PIECE: 'MOVE_PIECE',
};

const reducer = (state = null, action) => {
  switch (action.type) {
    case ActionType.SET_GAME:
      return action.game;
    default:
      return state;
  }
};

export default reducer;

const setGame = game => ({
  type: ActionType.SET_GAME,
  game,
});

// Game-logic related actions. Not to be used with this reducer, but rather to
// enqueued in the messageQueue.
const movePiece = ({ from, to }) => ({
  type: ActionType.MOVE_PIECE,
  from,
  to,
});

export { setGame, movePiece };
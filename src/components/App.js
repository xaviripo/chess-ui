import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { enqueue, dequeue } from '../reducers/messageQueue';
import { setGame, movePiece } from '../reducers/game';
import Scene from './Scene';
import _ from 'lodash/fp';






























// TODO:
/*

for some reason, since I installed _ (I think)
1. when server is disconnected, socketio sends a LOT more reqs to the server. This might be caused by (2):
2. when server is connected, it continuously creates new games, sending "accepted" messages constantly.
Debugging, it seems like the pieces received have different ids? not sure though
*/



































// Merge game and data, and then remove all nil (null or undefined) fields
const updateGame = (game, data) => {
  const gameCopy = _.cloneDeep(game);
  const dataCopy = _.cloneDeep(data);
  return _.omitBy(_.isNil, _.merge(gameCopy, dataCopy));
};

// Given the game.pieces object, convert it to a matrix of [row][col]
// containing just the piece data to be rendered (e.g. 'black_knight' or null)
const toMatrix = (pieces) => {

  pieces = pieces || {};

  const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const rows = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const board = Array(8).fill().map(() => Array(8).fill(null));

  for (const piece of Object.values(pieces)) {
    const name = `${piece.team}_${piece.rank}`;
    board[rows.indexOf(piece.square.row)][cols.indexOf(piece.square.col)] = name;
  }

  return board;

};

const App = () => {

  const dispatch = useDispatch();

  const { messageQueue, game } = useSelector(state => state);

  const socketRef = useRef(null);

  // Run on first render only
  useEffect(() => {
    socketRef.current = socketIOClient(process.env.REACT_APP_SERVER || '/');
    socketRef.current.on('waiting', data => {
      console.log('waiting: ', data)
      // On waiting, server sends data = null.
      setGame(null);
    });
    socketRef.current.on('started', data => {
      console.log('started: ', data);
      dispatch(setGame(data));
    });
    socketRef.current.on('accepted', data => {
      console.log('accepted: ', data);
      dispatch(setGame(updateGame(game || {}, data)));
    });
    socketRef.current.on('not accepted', data => {
      console.log('not accepted: ', data);
    });
  }, [dispatch, game]);

  // Run on every render (i.e. every time the state changes)
  useEffect(() => {
    if (messageQueue.length > 0) {
      socketRef.current.emit('action', messageQueue[0]);
      dispatch(dequeue());
    }
  }, [dispatch, messageQueue]);

  const makeMove = (move) => dispatch(enqueue(movePiece(move)));

  if (!game || Object.getOwnPropertyNames(game).length === 0) {
    return <p style={{ textAlign: 'center' }}>Waiting for another player to connect...</p>;
  }

  const board = toMatrix(game.pieces);

  return <Scene
    board={board}
    team={game.team}
    makeMove={makeMove} />;

};

export default App;

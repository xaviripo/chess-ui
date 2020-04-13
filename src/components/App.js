import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { enqueue, dequeue } from '../reducers/messageQueue';
import { setGame, movePiece } from '../reducers/game';
import Scene from './Scene';


const App = () => {

  const dispatch = useDispatch();

  const { messageQueue, game } = useSelector(state => state);

  const socketRef = useRef(null);

  // Run on first render only
  useEffect(() => {
    socketRef.current = socketIOClient('/');
    socketRef.current.on('init', data => {
      console.log('init: ', data);
      dispatch(setGame(data));
    });
    socketRef.current.on('accepted', data => {
      console.log('accepted: ', data);
      dispatch(setGame(data));
    });
    socketRef.current.on('illegal', data => {
      console.log('illegal: ', data);
      dispatch(setGame(data));
    });
    socketRef.current.on('unknown', data => {
      console.log('unknown: ', data);
      dispatch(setGame(data));
    });
  }, [dispatch]);

  // Run on every render (i.e. every time the state changes)
  useEffect(() => {
    if (messageQueue.length > 0) {
      socketRef.current.emit('action', messageQueue[0]);
      dispatch(dequeue());
    }
  }, [dispatch, messageQueue]);

  // TODO
  const makeMove = (move) => dispatch(enqueue(movePiece(move)));

  if (!game || Object.getOwnPropertyNames(game).length === 0) {
    return <p style={{ textAlign: 'center' }}>Waiting for another player to connect...</p>;
  }

  return <Scene
    scene={game.scene}
    team={game.team}
    makeMove={makeMove} />;

};

export default App;

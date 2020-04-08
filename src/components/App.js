import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import socketIOClient from 'socket.io-client';
import { enqueue, dequeue } from '../reducers/messageQueue';
import { setGame } from '../reducers/game';


const App = () => {

  const dispatch = useDispatch();

  const { messageQueue, game } = useSelector(state => state);

  const endpoint = '/';

  let socketRef = useRef(null);

  // Run on first render only
  useEffect(() => {
    console.log("first");
    socketRef.current = socketIOClient(endpoint);
    socketRef.current.on('init', data => dispatch(setGame(data.game)));
    socketRef.current.on('accepted', data => dispatch(setGame(data.game)));
    socketRef.current.on('illegal', data => dispatch(setGame(data.game)));
    socketRef.current.on('unknown', data => dispatch(setGame(data.game)));
  }, [dispatch]);

  // Run on every render (i.e. every time the state changes)
  useEffect(() => {
    console.log("all");
    if (messageQueue.length > 0) {
      socketRef.current.emit('action', messageQueue[0]);
      dispatch(dequeue());
    }
  }, [dispatch, messageQueue]);

  return <><button onClick={() => {dispatch(enqueue({type:'APPEND', payload:'hello'}))}}>append</button><button onClick={() => dispatch(enqueue({type:'REMOVE'}))}>remove</button><ul>
    {game.map((item, i) => <li key={i}>{item}</li>)}
  </ul></>;

};

export default App;

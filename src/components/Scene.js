import React from 'react';
import Teams from '../teams';

import whiteKing from '../assets/pieces/white_king.svg';
import whiteQueen from '../assets/pieces/white_queen.svg';
import whiteRook from '../assets/pieces/white_rook.svg';
import whiteBishop from '../assets/pieces/white_bishop.svg';
import whiteKnight from '../assets/pieces/white_knight.svg';
import whitePawn from '../assets/pieces/white_pawn.svg';

import blackKing from '../assets/pieces/black_king.svg';
import blackQueen from '../assets/pieces/black_queen.svg';
import blackRook from '../assets/pieces/black_rook.svg';
import blackBishop from '../assets/pieces/black_bishop.svg';
import blackKnight from '../assets/pieces/black_knight.svg';
import blackPawn from '../assets/pieces/black_pawn.svg';


/* Styles */

const boardStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
  borderSpacing: 0,
  borderCollapse: 'separate',
};

const squareStyle = {
  width: 60,
  height: 60,
  border: '1px solid white',
  margin: 0,
  padding: 0,
};


/* Handlers */

const dragEnterHandler = (event) => {
  event.currentTarget.style.border = '1px solid grey';
};

const dragLeaveHandler = (event) => {
  event.currentTarget.style.border = squareStyle.border;
};

const dragEndHandler = (event) => {
  for (const tr of event.currentTarget.parentElement.parentElement.children) {
    for (const td of tr.children) {
      td.style.border = squareStyle.border;
    }
  }
};

const makeDropHandler = (makeMove) => (event) => {

  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';

  const move = {
    from: JSON.parse(event.dataTransfer.getData('text')),
    to: [
      parseInt(event.currentTarget.dataset.rowIndex),
      parseInt(event.currentTarget.dataset.colIndex),
    ]
  };
  makeMove(move);
  console.log('dispatched move: ', move);

};

const dragOverHandler = (event) => {
  event.preventDefault();
};

const dragStartHandler = (event) => {
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text', JSON.stringify([
    parseInt(event.target.dataset.rowIndex),
    parseInt(event.target.dataset.colIndex),
  ]));
};

const imageFromPiece = (piece) => {
  // piece follows the "white_queen" format
  return {
    white_king: whiteKing,
    white_queen: whiteQueen,
    white_rook: whiteRook,
    white_bishop: whiteBishop,
    white_knight: whiteKnight,
    white_pawn: whitePawn,
    black_king: blackKing,
    black_queen: blackQueen,
    black_rook: blackRook,
    black_bishop: blackBishop,
    black_knight: blackKnight,
    black_pawn: blackPawn,
  }[piece];
}

const squareBackground = (url, color) =>
`no-repeat center url(${url}), ${color}`;

/* Components */

const Scene = ({ scene, team, makeMove }) => {

  const rows = scene.map((row, rowIndex) => {
    const squares = row.map((piece, colIndex) =>
      <Square

        key={colIndex}

        // Data
        square={piece}
        rowIndex={rowIndex}
        colIndex={colIndex}

        // Handlers
        makeMove={makeMove} />
    );
    return <tr key={rowIndex}>
      {team === Teams.WHITE ? squares.reverse() : squares}
    </tr>;
  });
  return <table style={boardStyle}><tbody>
    {team === Teams.WHITE ? rows.reverse() : rows}
  </tbody></table>;
};

const Square = ({ square, makeMove, rowIndex, colIndex }) => {
  const style = {
    ...squareStyle,
    background: squareBackground(imageFromPiece(square), ((rowIndex + colIndex) % 2 === 0) ? 'white' : 'gainsboro'),
  };
  return <td
      style={style}
      draggable="true"
      onDragStart={dragStartHandler}
      onDragOver={dragOverHandler}
      onDrop={makeDropHandler(makeMove)}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragEnd={dragEndHandler}
      data-row-index={rowIndex}
      data-col-index={colIndex}></td>;
};


/* Export */

export default Scene;
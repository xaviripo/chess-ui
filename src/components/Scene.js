import React from 'react';
import Teams from '../teams';


/* Styles */

const boardStyle = {
  marginLeft: 'auto',
  marginRight: 'auto',
};

const squareStyle = {
  fontSize: 40,
  width: 60,
  height: 60,
  textAlign: 'center',
  border: 'none',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
};

const pieceStyle = {
  cursor: 'grab',
};


/* Components */

const Scene = ({ scene, team, dropHandler, dragOverHandler, dragStartHandler }) => {
  const rows = scene.map((row, rowIndex) => <tr key={rowIndex}>
    {row.map((piece, colIndex) =>
      <Square

        key={colIndex}

        // Data
        square={piece}
        rowIndex={rowIndex}
        colIndex={colIndex}

        // Handlers
        dropHandler={dropHandler}
        dragOverHandler={dragOverHandler}
        dragStartHandler={dragStartHandler} />
    )}
  </tr>);
  return <table style={boardStyle}><tbody>
    {team === Teams .WHITE ? rows.reverse() : rows}
  </tbody></table>;
};

const Square = ({ square, rowIndex, colIndex, dropHandler, dragOverHandler, dragStartHandler }) => {
  const style = {
    ...squareStyle,
    backgroundColor: ((rowIndex + colIndex) % 2 === 0) ? 'white' : 'gainsboro',
  };
  return <td
      style={style}
      onDragOver={dragOverHandler}
      onDrop={dropHandler}
      data-row-index={rowIndex}
      data-col-index={colIndex}>
      <Piece
        piece={square}
        dragStartHandler={dragStartHandler} />
    </td>;
};

const Piece = ({ piece, dragStartHandler }) => <span
    style={pieceStyle}
    draggable="true"
    onDragStart={dragStartHandler}
    >
    {piece}
  </span>;


/* Export */

export default Scene;
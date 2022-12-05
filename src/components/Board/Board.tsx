import React, { FC } from "react";
import { onOver } from "../../services/dndService";
import { Board as BoardType } from "../../types";
import { Item } from "../Item";

interface BoardProp {
  setModal: Function;
  handleDropBoard: Function;
  handleStart: Function;
  handleDrop: Function;
  board: BoardType;
  handleMore: Function;
}

export const Board: FC<BoardProp> = ({
  setModal,
  handleDrop,
  handleDropBoard,
  handleStart,
  handleMore,
  board,
}) => {
  return (
    <div
      onDrop={(e) => handleDropBoard(e, board)}
      onDragOver={onOver}
      key={board.id}
      className="board desk__board"
    >
      <h2 className="board__title">
        {board.title}
        {board.id === 1 ? (
          <button
            style={{
              marginLeft: "50px",
              padding: "5px 10px",
              background: "green",
            }}
            onClick={() => setModal("create")}
          >
            +
          </button>
        ) : null}
      </h2>
      <ul className="item-wapper">
        {board.items.map((item) => {
          const isDead = Date.parse(item.deadline) - Date.now() < 0;
          return (
            <Item
              item={item}
              isDead={isDead}
              board={board}
              handleDrop={handleDrop}
              handleMore={handleMore}
              handleStart={handleStart}
            />
          );
        })}
      </ul>
    </div>
  );
};

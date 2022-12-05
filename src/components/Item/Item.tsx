import React, { FC } from "react";
import { onEnd, onLeave, onOver } from "../../services/dndService";
import { Board, Item as ItemType } from "../../types";
import "./Item.scss";

interface ItemProp {
  item: ItemType;
  isDead: boolean;
  board: Board;
  handleStart: Function;
  handleMore: Function;
  handleDrop: Function;
}

export const Item: FC<ItemProp> = ({
  item,
  isDead,
  board,
  handleDrop,
  handleMore,
  handleStart,
}) => {
  return (
    <div
      key={item.id}
      draggable
      onDragOver={onOver}
      onDragLeave={onLeave}
      onDragStart={(e) => handleStart(e, board, item)}
      onDragEnd={onEnd}
      onDrop={(e) => handleDrop(e, board, item)}
      className="board__item item"
      style={{
        borderColor: isDead && board.id !== 3 ? "red" : "#30363d",
      }}
    >
      <div className="item__head">
        <h3 className="item__title">
          <span
            className="indicator"
            style={{
              background:
                item.prior === "average"
                  ? "yellow"
                  : item.prior === "high"
                  ? "red"
                  : "green",
            }}
          ></span>
          {item.title}
          <span className="item__title-taskcount">{item.tasks.length}</span>
        </h3>
        <div className="item__deadline">{item.deadline}</div>
      </div>
      <div className="item__body">
        <div>
          <p>Files: {item.files?.length}</p>
          <p>Created: {item.created.toString()}</p>
        </div>
        <button className="item__more" onClick={() => handleMore(item)}>
          More
        </button>
      </div>
    </div>
  );
};

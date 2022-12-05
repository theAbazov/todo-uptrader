import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Board, Project } from "../../types";
import { Item } from "../../types/main";
import { onDrop, onDropBoard } from "../../services/dndService";
import "./Boards.scss";
import { Board as BoardComponent } from "../Board";

interface BoardsProp {
  boards: Board[];
  setBoards: Function;
  setModal: Function;
  setCurrentDetail: Function;
}

export const Boards: FC<BoardsProp> = ({
  boards,
  setBoards,
  setModal,
  setCurrentDetail,
}) => {
  const { projectId } = useParams();

  //DnD states
  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  //DnD states

  // DnD actions start
  const handleMore = (item: Item) => {
    setCurrentDetail(item);
    setModal("detail");
  };

  const handleStart = (e: any, board: Board, item: Item) => {
    e.stopPropagation();
    setCurrentBoard(board);
    setCurrentItem(item);
  };

  const handleDrop = (e: any, board: Board, item: Item) => {
    e.stopPropagation();
    e.preventDefault();
    setBoards(onDrop(board, item, currentBoard!, currentItem!, boards!));
  };

  const handleDropBoard = (e: any, board: Board) => {
    e.preventDefault();
    setBoards(onDropBoard(board!, currentItem!, currentBoard!, boards!));
  };

  const saveEffect = () => {
    let projects: Project[] = JSON.parse(localStorage.getItem("projects")!);

    if (boards) {
      projects = projects.map((project) => {
        if (project.id === +projectId!) {
          project.data = boards!;
        }
        return project;
      });
    }
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  useEffect(saveEffect, [boards, projectId]);
  // DnD actions end

  return (
    <div>
      <ul className="desks-content">
        {boards &&
          boards.map((board) => {
            return (
              <BoardComponent
                setModal={setModal}
                handleStart={handleStart}
                handleMore={handleMore}
                handleDropBoard={handleDropBoard}
                handleDrop={handleDrop}
                board={board}
              />
            );
          })}
      </ul>
    </div>
  );
};

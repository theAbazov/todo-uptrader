import React, { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BoardHead } from "../components/BoardHead";
import { Boards } from "../components/Boards";
import Create from "../components/CreateTaskModal/Create";
import { EditProjectName } from "../components/EditProjectName";
import { TaskDetail } from "../components/TaskDetail";
import { Board, Item, Project } from "../types";

export const BoardsPage: FC<{
  setProjects: Function;
  projects: Project[];
}> = ({ setProjects, projects }) => {
  const { projectId } = useParams();

  const [boards, setBoards] = useState<Board[]>();
  const [projectName, setProjName] = useState("");

  // modal states
  const [modal, setModal] = useState<string>("");
  const [currentDetail, setCurrentDetail] = useState<Item>();
  // modal states

  useEffect(() => {
    const projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    projects.forEach((proj) => {
      if (proj.id === +projectId!) {
        setBoards(proj.data);
        setProjName(proj.projectName);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects]);

  return (
    <div className="desks">
      {modal === "detail" ? (
        <TaskDetail
          setModal={setModal}
          data={currentDetail}
          projectId={+projectId!}
        />
      ) : modal === "create" ? (
        <Create
          type="Create"
          setProjects={setProjects}
          setModal={setModal}
          projectId={+projectId!}
          item={undefined}
        />
      ) : modal === "edit" ? (
        <Create
          type="Edit"
          setProjects={setProjects}
          setModal={setModal}
          projectId={+projectId!}
          item={currentDetail}
        />
      ) : modal === "projectModal" ? (
        <EditProjectName
          setModal={setModal}
          setProjects={setProjects}
          id={+projectId!}
        />
      ) : null}
      <BoardHead
        setModal={setModal}
        setProjects={setProjects}
        projectName={projectName}
        projectId={+projectId!}
      />
      <Boards
        setCurrentDetail={setCurrentDetail}
        setBoards={setBoards}
        setModal={setModal}
        boards={boards!}
      />
    </div>
  );
};

import React, { FC } from "react";
import { removeProject } from "../../services/projectService";
import { useNavigate } from "react-router-dom";
import "./BoradHead.scss";

interface BoardHeadProps {
  projectName: string;
  setModal: Function;
  setProjects: Function;
  projectId: number;
}

export const BoardHead: FC<BoardHeadProps> = ({
  projectName,
  setModal,
  setProjects,
  projectId,
}) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    const conf = confirm("Are you sure to delete this project?");
    if (!conf) return;
    setProjects(removeProject(projectId));
    navigate("/");
  };

  return (
    <div className="desks__header">
      <div className="desks__header-start">
        <h1 className="desks__header-title">{projectName}</h1>
        <button
          onClick={() => setModal("")}
          className="desks__header-edit btns"
        >
          Edit
        </button>
        <button onClick={handleDelete} className="desks__header-delete btns">
          Delete
        </button>
      </div>
    </div>
  );
};

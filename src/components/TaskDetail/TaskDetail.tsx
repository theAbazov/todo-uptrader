import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeTogle, deleteCurrentTodo } from "../../services/todoService";
import { Item } from "../../types";
import { Comments } from "../Comments/Comments";
import "./TaskDetail.scss";

export const TaskDetail: FC<{
  setModal: Function;
  data: Item | undefined;
  projectId: number;
  setProjects: Function;
}> = ({ setModal, data, projectId, setProjects }) => {
  const {
    id,
    title,
    prior,
    desc,
    tasks: propTasks,
    files,
    created,
    deadline,
    devTime,
    comments,
  } = data!;

  const navigate = useNavigate();
  const [tasks, setTasks] = useState(propTasks);

  const handleDelete = (e: any) => {
    // eslint-disable-next-line no-restricted-globals
    const conf = confirm("Are you sure to delete the task?");
    if (!conf) return;
    deleteCurrentTodo(projectId, id);
    navigate("/");
  };

  const handleComplete = (taskId: number) => {
    const res = completeTogle(projectId, id, taskId);
    setTasks(res);
  };
  console.log(comments);

  return (
    <div onClick={() => setModal(false)} className="taskdetail">
      <div onClick={(e) => e.stopPropagation()} className="taskdetail-content">
        <div className="taskdetail__head">
          <h3>
            {title}{" "}
            <span
              style={{
                background:
                  prior === "average"
                    ? "yellow"
                    : prior === "high"
                    ? "red"
                    : "green",
              }}
              className="indicator"
            ></span>
          </h3>
          <div className="taskdetail__btns">
            <button
              onClick={() => setModal("edit")}
              className="taskdetail__btns-edit"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="taskdetail__btns-delete">
              Delete
            </button>
          </div>
        </div>
        <div className="taskdetail__desc">
          <p>{desc}</p>
          <Comments comments={comments} />
        </div>
        <ul className="taskdetail__childs">
          Tasks:
          {tasks.length
            ? tasks.map((task) => {
                return (
                  <div key={task.id} className="taskdetail__child">
                    <label>
                      <input
                        onChange={() => handleComplete(task.id)}
                        type="checkbox"
                        checked={task.completed}
                      />
                      {task.title}
                    </label>
                  </div>
                );
              })
            : " No task"}
        </ul>
        <ul className="taskdetail__files">
          Files:
          {files?.length
            ? files!.map((file) => (
                <div key={file.name} className="taskdetail__file">
                  <a href={file.url} target="_blank" rel="noreferrer">
                    {file.name}
                  </a>
                  <a className="download" href={file.url} download>
                    download
                  </a>
                </div>
              ))
            : " No file"}
        </ul>
        <div className="taskdetail__foot">
          <div>Created: {created + ""}</div>
          <div>
            Development time:{" "}
            {`${Math.floor(devTime / 60 / 60)} : ${Math.floor(
              (devTime / 60) % 60
            )} : ${devTime % 60}s`}
          </div>
          <div>Deadline: {deadline}</div>
        </div>
      </div>
    </div>
  );
};

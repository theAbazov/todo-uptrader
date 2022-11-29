import { FC } from "react";
import { Item } from "../../types";
import "./TaskDetail.scss";

export const TaskDetail: FC<{ setModal: Function; data: Item | undefined }> = ({
  setModal,
  data,
}) => {
  const { title, prior, desc, tasks, files, created, deadline, devTime } =
    data!;
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
            <button className="taskdetail__btns-edit">Edit</button>
            <button className="taskdetail__btns-delete">Delete</button>
          </div>
        </div>
        <div className="taskdetail__desc">{desc}</div>
        <ul className="taskdetail__childs">
          Tasks:
          {tasks.map((task) => {
            return (
              <div key={task.title} className="taskdetail__child">
                <label>
                  <input type="checkbox" checked={task.completed} />
                  {task.title}
                </label>
              </div>
            );
          })}
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
          <div>Development time: {devTime + ""}</div>
          <div>Deadline: {deadline}</div>
        </div>
      </div>
    </div>
  );
};

import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  commentParent,
  completeTogle,
  deleteCurrentTodo,
} from "../../services/todoService";
import { v4 } from "uuid";
import { Comment, Item } from "../../types";
import { Comments } from "../Comments/Comments";
import "./TaskDetail.scss";
import { format } from "date-fns";

export const TaskDetail: FC<{
  setModal: Function;
  data: Item | undefined;
  projectId: number;
}> = ({ setModal, data, projectId }) => {
  const {
    id,
    title,
    prior,
    desc,
    tasks: propTasks,
    files,
    created,
    deadline: propDead,
    devTime,
    comments: propComments,
  } = data!;

  const navigate = useNavigate();
  // Стейты просто для обновления верстки, другого варианта не видел)
  const [tasks, setTasks] = useState(propTasks);
  const [comments, setComments] = useState(propComments);
  // Стейты просто для обновления верстки
  const [commentInput, setCommentInput] = useState(false);
  const [commentValue, setCommentValue] = useState("");

  // spread не сработал для  new Date(...deadline) внизу
  const deadline = propDead.split("-");
  const d1 = +deadline[2];
  const d2 = +deadline[1] - 1;
  const d3 = +deadline[0];
  // spread не сработал для  new Date(...deadline) внизу

  const handleDelete = (e: any) => {
    e.preventDefault();
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

  const handleComment = (e: any) => {
    e.preventDefault();
    const newComment: Comment = {
      id: v4(),
      text: commentValue,
      comments: [],
    };
    setComments(commentParent(projectId, id, newComment));
    setCommentInput(false);
    setCommentValue("");
  };

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
          {commentInput ? (
            <form onSubmit={(e) => handleComment(e)}>
              <input
                autoFocus
                type="text"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                placeholder="Comment"
                width={150}
              />
              <button className="comments__button">Comment</button>
              <button
                onClick={() => setCommentInput(false)}
                className="comments__button cancel"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setCommentInput(true)}
              className="comments__button"
            >
              Comment
            </button>
          )}
          <Comments comments={comments} setComments={setComments} itemId={id} />
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
              (devTime / 60) % 60,
            )} : ${devTime % 60}s`}
          </div>
          <div>Deadline: {format(new Date(d1, d2, d3), "PP")}</div>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable @typescript-eslint/no-shadow */
import React, { FC, useEffect, useState } from "react";
import { createTodo, updateTodo } from "../../services/todoService";
import { File, Item, Project, Task } from "../../types";
import "./Create.scss";

const Create: FC<{
  type: string;
  setProjects: Function;
  setModal: Function;
  projectId: number;
  item: Item | undefined;
}> = ({ type, setProjects, setModal, projectId, item }) => {
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [prior, setPrior] = useState("average");
  const [deadline, setDeadline] = useState("");
  const [editId, setEditId] = useState<number>();

  useEffect(() => {
    if (type === "Edit") {
      if (item) {
        const { id, title, desc, files, tasks, prior, deadline } = item;
        setName(title);
        setDesc(desc);
        setFiles(files!);
        setTasks(tasks);
        setPrior(prior);
        setDeadline(deadline);
        setEditId(id);
      }
    }
  }, [type]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!desc || !name || !deadline) return;
    const projects: Project[] = JSON.parse(localStorage.getItem("projects")!);
    let id = projects.reduce((a, b) => {
      if (b.id === projectId) {
        return a + b.data.reduce((a, b) => a + b.items.length, 0);
      }
      return a;
    }, 1);

    const check = type === "Edit";

    id = check ? editId! : id;

    const created = check ? item?.created! : new Date().toDateString();

    const comments = check ? item?.comments! : [];

    const devTime = check ? item?.devTime! : 0;

    const newTodo: Item = {
      id,
      title: name,
      desc,
      prior,
      tasks,
      files,
      comments,
      created,
      deadline,
      devTime,
    };
    const result = check
      ? updateTodo(projectId, item?.id!, newTodo)
      : createTodo(projectId, newTodo);
    setProjects(result);
    setModal("");
  };

  const onFileChange = (file: any) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      setFiles((files) => [
        ...files,
        { name: file.name, url: reader.result + "" },
      ]);
    });
    reader.readAsDataURL(file);
  };

  const deleteFile = (name: string) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const deleteTask = (title: string) => {
    setTasks((tasks) => tasks.filter((task) => task.title !== title));
  };

  const addTask = (e: any) => {
    e.preventDefault();
    if (!taskName) return;
    setTasks((tasks) => [
      ...tasks,
      { title: taskName, completed: false, id: tasks.length },
    ]);
    setTaskName("");
  };

  const updateTask = (id: number) => {
    setTasks((tasks) =>
      tasks.map((task) => {
        if (task.id === id) task.completed = !task.completed;
        return task;
      }),
    );
  };

  return (
    <div onClick={() => setModal("")} className="create">
      <form onClick={(e) => e.stopPropagation()} className="create-content">
        <h3 className="create__title">{type} project</h3>
        <div className="create-wrapper">
          <div className="create__left">
            <h3>Name:</h3>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="create__name"
            />
            <h3>Decsription:</h3>
            <textarea
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
              cols={60}
              rows={17}
              className="create__desc"
            ></textarea>
          </div>
          <div className="create__right">
            <div className="create__files">
              <h3>Files:</h3>
              {files &&
                files.map((file) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "430px",
                      marginLeft: "20px",
                      marginBottom: "10px",
                    }}
                  >
                    <div>{file.name}</div>
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteFile(file.name)}
                    >
                      x
                    </p>
                  </div>
                ))}
              <label className="create__file">
                Choice File
                <input
                  hidden
                  type="file"
                  onChange={(e) => onFileChange(e.target.files![0])}
                  placeholder="choice file"
                />
              </label>
            </div>
            <div className="create__tasks">
              <h3>Tasks:</h3>
              {tasks &&
                tasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "430px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "430px",
                      }}
                    >
                      {task.title}
                      <input
                        style={{ width: " 30px" }}
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => updateTask(task.id)}
                      />
                    </div>
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => deleteTask(task.title)}
                    >
                      x
                    </p>
                  </div>
                ))}
              <input
                type="text"
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task"
                value={taskName}
              />
              <button
                style={{
                  background: "transparent",
                  color: "white",
                  border: "1px solid white",
                  outline: "none",
                }}
                onClick={addTask}
              >
                Add task
              </button>
            </div>
            <h3>Priority:</h3>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <label>
                Low:
                <input
                  onChange={(e) => setPrior(e.target.value)}
                  type="radio"
                  name="prior"
                  value={"low"}
                />
              </label>
              <label>
                Average
                <input
                  onChange={(e) => setPrior(e.target.value)}
                  type="radio"
                  name="prior"
                  value={"average"}
                  checked
                />
              </label>
              <label>
                High:
                <input
                  onChange={(e) => setPrior(e.target.value)}
                  type="radio"
                  name="prior"
                  value={"high"}
                />
              </label>
            </div>
            <h3>DeadLine:</h3>
            <input
              style={{ marginLeft: "20px" }}
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button className="add-todo" onClick={onSubmit}>
            {type}
          </button>
        </div>{" "}
      </form>
    </div>
  );
};

export default Create;
